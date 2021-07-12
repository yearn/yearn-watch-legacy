import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
