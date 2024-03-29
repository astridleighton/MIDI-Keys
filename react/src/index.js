import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

/* Application: MIDI Keys Web Application
* Developed by: Astrid Leighton
* Latest update: March 23rd, 2023
* Start-up: navigate to react directory, type "npm start" (ensure express back-end is working by navigating to express dir and typing "node index.js")*/

const root = ReactDOM.createRoot(document.getElementById('root'));

// renders application at App.js parent component
root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
