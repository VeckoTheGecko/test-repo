import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { AppProvider } from './services/queue.service';
import { ipcRenderer } from 'electron';

ipcRenderer.on('INITIALIZE_QUEUE', (event, data) => {
    console.log(data)
    const mainElement = document.createElement('div');
    document.body.appendChild(mainElement);

    ReactDOM.render(<AppProvider initial_state={data}><App /></AppProvider>, mainElement);
});

