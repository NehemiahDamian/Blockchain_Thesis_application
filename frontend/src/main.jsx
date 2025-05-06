import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import theme, { Fonts } from "./components/theme";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ChakraProvider theme={theme}>
    <Fonts />


    <App />
    </ChakraProvider>

    </BrowserRouter>
  </StrictMode>,
)
