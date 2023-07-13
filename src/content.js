// init connection
let port = chrome.runtime.connect({ name: 'bcex' });
console.log('[bcex-cnt] content script established')

// post data back to bg
port.postMessage({ text: 'handshake from content script' });

// handle retrieve data from bg
port.onMessage.addListener(msg => {
  console.log('[bcex-cnt] msg: full data from bg', msg.data)
  if (msg.data.isActive) {
    const handler = new Handler(msg.data);
    handler.process()
  }
})


class Handler {
  constructor(data) {
    this.data = data
    this.BANK_CODE_SELECTOR = '#bankCode'
    this.BANK_CONN_CODE_SELECTOR = '#bankConnCode'
    this.MID_SELECTOR = '#merchantTransID'
    this.TEST_BTN_SELECTOR = '#root > div > div.zpb-main.row > div > div > div > div.card-body > form > div:nth-child(5) > div > div > button:nth-child(1)'
    this.AUTO_INCREMENT = data.isAutoIncreaseMerchantTransId
    this.CAUTION_TITLE = '#root > div > div.zpb-main.row > div > div > div > div.custom-card-header.card-header'
  }

  doInitCautionTitle() {
    const div = document.querySelector(this.CAUTION_TITLE);
    const alert = document.createElement('h6')
    alert.innerText = 'BC EXTENSION IS WORKING!'
    div.appendChild(alert)
    alert.style.color = 'red'
    alert.style.textAlign = 'center'   
  }

  async doVisualizeData() {
    const cnt = document.querySelector(this.BANK_CODE_SELECTOR)
    cnt.value = this.data.bankCode
    cnt.defaultValue = this.data.bankCode
    const conn = document.querySelector(this.BANK_CONN_CODE_SELECTOR)
    conn.value = this.data.bankConnCode
    conn.defaultValue = this.data.bankConnCode
    return {cnt: cnt, conn: conn}
  }

  doIncreaseMerchantTransId() {
    if (this.AUTO_INCREMENT) {
      const mid = document.querySelector(this.MID_SELECTOR)
      const nMid = parseInt(mid.value) + 1
      mid.value = nMid.toString()
      mid.defaultValue = nMid.toString()
      return nMid;
    }
  }

  checkIfClickedToResetVisualizedData() {
    let events = ['click', 'input']
    events.forEach(event => document.addEventListener(event, () => this.doVisualizeData()))
  }

  checkIfTestBtnIsClicked() {
    const parent = document.querySelector('#root');

    parent.addEventListener('click', async (event) => {
      if (event.target.matches(this.TEST_BTN_SELECTOR)) {
        let obj = await this.doVisualizeData();
        alert(obj.cnt.value + ' ' + obj.conn.value)
        // alert('Hi!')
        // await this.doVisualizeData();
        // this.doIncreaseMerchantTransId();
        // send back request to bg
        // port.postMessage({ signal: true, mid: this.doIncreaseMerchantTransId()});
      }
    });
  }

  process() {
    this.doInitCautionTitle()
    this.doVisualizeData()
    this.doIncreaseMerchantTransId()
    this.checkIfClickedToResetVisualizedData()
    this.checkIfTestBtnIsClicked()
  }
}



