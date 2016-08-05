import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const d3 = require('d3')
let dataJson = require('./cars-by-day.json')
let parseDate = d3.timeParse('%Y-%m-%d')
// parse date
dataJson.forEach((d) => {
  d.date = parseDate(d.date)
})
const padding = 30
const width = 800
const height = 400

ReactDOM.render(
  <App data={dataJson} width={width} height={height} padding={padding}/>,
  document.getElementById('root')
);
