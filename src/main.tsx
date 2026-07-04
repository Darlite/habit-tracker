import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import App from './App';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1a1a1a;
    background: #fff;
  }

  h1, h2, h3 {
    font-weight: 600;
  }
`;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalStyle />
        <App />
    </StrictMode>
);