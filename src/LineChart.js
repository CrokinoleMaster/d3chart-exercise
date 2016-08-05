import React, { PropTypes, Component } from 'react'
import Chart from './Chart'
import DataSeries from './DataSeries'

const d3 = require('d3')

class LineChart extends Component {

  colorArray = [
    'rebeccapurple',
    'steelblue',
    'turquoise',
    'springgreen',
    'khaki',
    'lightsalmon',
    'firebrick'
  ]

  componentDidMount() {
    let { xScale, yScale, height, width, padding } = this.props
    this.xAxis = d3.axisBottom(xScale).ticks(5)
    this.yAxis = d3.axisLeft(yScale).ticks(5)
    d3.select(this._xNode)
      .attr('transform', `translate(0, +${height-padding})`)
      .call(this.xAxis)
    d3.select(this._yNode)
      .attr('transform', `translate(${padding}, 0)`)
      .call(this.yAxis)
  }

  componentDidUpdate() {
    let { xScale, yScale, data } = this.props
    this.xAxis.scale(xScale)
    this.yAxis.scale(yScale)
    d3.select(this._xNode)
      .transition()
      .call(this.xAxis)
    d3.select(this._yNode)
      .transition()
      .call(this.yAxis)
  }

  render() {
    let { data, width, height, xScale, yScale, padding, xProp, yProp } = this.props
    let size = {width, height}

    return (
      <Chart width={width} height={height} style={{padding}}>
        <g className='x-axis' ref={(c) => this._xNode = c}></g>
        <g className='y-axis' ref={(c) => this._yNode = c}></g>
        {Object.keys(data).map((year, i) => {
          let yearData = data[year]
          return <DataSeries key={i} data={yearData} size={size} xScale={xScale}
            yScale={yScale} color={this.colorArray[i]} xProp={xProp} yProp={yProp}/>
        })}
      </Chart>
    )
  }
}

LineChart.defaultProps = {
  width: 600,
  height: 300
}

LineChart.PropTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  x: PropTypes.func,
  x: PropTypes.func,
  xProp: PropTypes.string,
  yProp: PropTypes.string
}

export default LineChart
