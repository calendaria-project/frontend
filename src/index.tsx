import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import AuthContextProvider from "./context/AuthContextProvider";
import App from './components/Main/App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AuthContextProvider>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </AuthContextProvider>
);
