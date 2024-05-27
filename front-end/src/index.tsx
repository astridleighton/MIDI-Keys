import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MidiProvider } from './MidiContext';

/* Application: MIDI Keys Web Application
* Developed by: Astrid Leighton
* Latest update: April 22nd, 2024
* Start-up: navigate to react directory, type "npm start" (ensure express back-end is working by navigating to express dir and typing "node index.js")*/

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  // renders application at App.js parent component
  root.render(
    <React.StrictMode>
      <MidiProvider>
          <App />
      </MidiProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root container not found.");
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
