let data = {
    bankCode: '',
    bankConnCode: '',
    isActive: false,
    isAutoIncreaseMerchantTransId: false,
    isBeautifyJson: false
}

const getDataFromStorage = async (data, resolver) => {
    chrome.storage.sync.get([
        'bankCode', 
        'bankConnectorCode', 
        'isActive', 
        'isAutoIncreaseMerchantTransId',
        'isBeautifyJson'
    ], (result) => {
        data.bankCode = result.bankCode;
        data.bankConnCode = result.bankConnectorCode;
        data.isActive = result.isActive;
        data.isAutoIncreaseMerchantTransId = result.isAutoIncreaseMerchantTransId;
        data.isBeautifyJson = result.isBeautifyJson; 
        resolver();
    });
}


chrome.runtime.onConnect.addListener(async port => {
    if (port.name === 'bcex') {
        // log initialized
        console.log('[bcex-bg] connection established')

        // first loaded page
        await getDataFromStorage(data, () => {
            // send data to content script
            port.postMessage({ data: data });
            // console.log('[bcex-bg] data sent to content script', data)
        });
        
        // wait if tab is updated
        await chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url.includes('qcbctest')) {
                // query bank code and bank connection code
                await getDataFromStorage(data, () => {
                    // send data to content script
                    port.postMessage({ data: data });
                    // console.log('[bcex-bg] data sent to content script', data)
                });
            }
        });

        // handshake
        port.onMessage.addListener(msg => {
            console.log('[bcex-bg] msg:', msg.text)
        });

        // Unusable -> Can't modify request body since 2016
        // port.onMessage.addListener(msg => modifyRequestBody(msg))
    }
});

// Unusable
// const modifyRequestBody = (msg) => {
//     if (msg.signal) {
//         chrome.webRequest.onBeforeRequest.addListener(details => {
//             const buffer = details.requestBody.raw[0].bytes;
//             const requestBody = JSON.parse(new TextDecoder('utf-8').decode(buffer));

//             // change request body
//             requestBody.bankcode = data.bankCode;
//             requestBody.bankconncode = data.bankConnCode;
//             requestBody.merchanttransid = msg.mid;
//             console.log('[bcex-bg] requestBody', requestBody);

//             // Convert the modified payload back to a string
//             const modifiedData = JSON.stringify(requestBody);

//             // Create a new request with the modified payload
//             const modifiedRequest = Object.assign({}, details.request, {
//                 requestBody: [{
//                     bytes: Uint8Array.from(modifiedData, c => c.charCodeAt(0)).buffer
//                 }]
//             });

//             return { request: modifiedRequest };
//         }, { urls: ['<all_urls>'], types: ['xmlhttprequest'] }, ['requestBody']);
//     }
// }