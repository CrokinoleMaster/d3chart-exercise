import React, { PropTypes } from 'react'
import Line from './Line'

const d3 = require('d3')


let DataSeries = function({ xScale, yScale, data, color, interpolate, xProp, yProp }) {
  let path = d3.line()
    .x((d) => xScale(d[xProp]))
    .y((d) => yScale(d[yProp]))
    // .curve(interpolate)
  return (
    <Line path={path(data)} color={color} />
  )
}

DataSeries.defaultProps = {
  title: '',
  data: [],
  interpolate: 'linear'
}

DataSeries.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  interpolate: PropTypes.string,
  xProp: PropTypes.string,
  yProp: PropTypes.string
}

export default DataSeries
