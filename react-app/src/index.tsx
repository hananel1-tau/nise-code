import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from '@mui/material/CssBaseline';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter  } from 'react-router-dom';


const mdTheme = createTheme();


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
     <Auth0Provider
    domain="dev-1x0qmo4r.us.auth0.com"
    clientId="ggNqt7ijBuecU0CG00gFTrH3JRDNAroM"
    redirectUri={window.location.origin}
  >
    <ThemeProvider theme={mdTheme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
    </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
