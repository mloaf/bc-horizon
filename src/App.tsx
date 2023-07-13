import { useState } from 'react'
// import logo from './logo.svg'
import './App.css'
import React from 'react'
import { Typography } from '@mui/joy'
import MainForm from './components/FormComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <Typography 
          level='h1'
          textColor={'white'}
          fontSize='md' 
          fontFamily={'sans-serif'}
        >
          BC Extension
        </Typography>
        <MainForm onSave={(bankCode, connectorCode) => {}} />
        <Typography level="body5" color='neutral' fontSize='sm' fontFamily={'sans-serif'}>Pre-release version 0.0.1</Typography>
      </header>
      {/* <img
        src={chrome.runtime.getURL(logo)}
        className='App-logo'
        alt='logo'
      /> */}
      <body>
        
      </body>
    </div>
  )
}

export default App
