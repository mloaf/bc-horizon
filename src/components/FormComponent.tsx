import React, { useEffect, useState } from 'react';
import { Button, Card, FormControl, Input, Chip, Checkbox, Typography, Stack } from '@mui/joy';

interface CardComponentProps {
  onSave: (bankCode: string, connectorCode: string) => void;
}

const MainForm: React.FC<CardComponentProps> = ({ onSave }) => {
  const [bankCode, setBankCode] = useState('');
  const [connectorCode, setConnectorCode] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isAutoIncreaseMerchantTransId, setIsAutoIncreaseMerchantTransId] = useState(false);
  const [isBeautifyJson, setIsBeautifyJson] = useState(false);

  const loadDataFromStorage = () => {
    chrome.storage.sync.get('bankCode', (data) => {
      setBankCode(data.bankCode);
    });
    chrome.storage.sync.get('bankConnectorCode', (data) => {
        setConnectorCode(data.bankConnectorCode);
    });
    chrome.storage.sync.get('isActive', (data) => {
        setIsActive(data.isActive);
    });
    chrome.storage.sync.get('isAutoIncreaseMerchantTransId', (data) => {
        setIsAutoIncreaseMerchantTransId(data.isAutoIncreaseMerchantTransId);
    });
    chrome.storage.sync.get('isBeautifyJson', (data) => { 
        setIsBeautifyJson(data.isBeautifyJson);
    });
  }

  useEffect(() => {
    loadDataFromStorage();
  }, [])

  const save = async(k, v, callback) => {
    const obj = {};
    obj[k] = v;
    chrome.storage.sync.set(obj);
    callback();
  }

  const handleSave = () => {
    setIsActive(!isActive)
    if (isActive) {
        save('isAutoIncreaseMerchantTransId', false, () => {});
        setIsAutoIncreaseMerchantTransId(false);
        save('isBeautifyJson', false, () => {});
        setIsBeautifyJson(false);
    }
    save('bankCode', bankCode, () => {});
    save('bankConnectorCode', connectorCode, () => {});
    save('isActive', !isActive, () => {});
  };

  return (
      <FormControl sx={{ padding: '16px' }}>
        <Stack direction="row" spacing={2} sx={{ marginBottom: '16px' }}>
            <Chip
                sx={{
                    marginRight: '-10px',
                    maxWidth: 'fit-content'
                }}
            >
                PR0.0.1
            </Chip>
            <Chip
                variant="solid"
                color={isActive ? 'success' : 'danger'}
                sx={{
                    maxWidth: 'fit-content'
                }}
            >
                {isActive ? 'Activated' : 'Deactivated'}
            </Chip>
        </Stack>
        <Input
          color="neutral"
          placeholder="Bank Code"
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
          sx={{ marginBottom: '16px' }}
        />
        <Input
          color="neutral"
          placeholder="Bank Connector Code"
          value={connectorCode}
          onChange={(e) => setConnectorCode(e.target.value)}
          sx={{ marginBottom: '16px' }}
        />
        <Checkbox
            color="neutral"
            disabled={false}
            checked={isAutoIncreaseMerchantTransId}
            label="Enable auto increase mID"
            variant="soft"
            sx={{ marginBottom: '16px', textAlign: 'left', color: 'white'}}
            onChange={() => { 
                setIsAutoIncreaseMerchantTransId(!isAutoIncreaseMerchantTransId)
                save('isAutoIncreaseMerchantTransId', !isAutoIncreaseMerchantTransId, () => {}) 
            }}
        />
        <Checkbox
            color="neutral"
            disabled={false}
            checked={isBeautifyJson}
            label="Enable JSON beautify"
            variant="soft"
            sx={{ marginBottom: '16px', textAlign: 'left', color: 'white'}}
            onChange={() => { 
                setIsBeautifyJson(!isBeautifyJson);
                save('isBeautifyJson', !isBeautifyJson, () => {})
            }}
        />
        <Button onClick={handleSave}>
          {isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </FormControl>
  );
};

export default MainForm;
