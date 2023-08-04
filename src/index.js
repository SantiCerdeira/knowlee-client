import React from 'react';
import ReactDOM from 'react-dom/client';

import 'swiper/css'; 
import 'swiper/css/effect-coverflow';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { NODE_ENV } from './utils/helpers/config';
import {disableReactDevTools} from '@fvilers/disable-react-devtools'

if(NODE_ENV === 'production') disableReactDevTools()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
