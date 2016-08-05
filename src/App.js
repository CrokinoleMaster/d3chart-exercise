import React, { Component, PropTypes } from 'react';
import './App.css';
import LineChart from './LineChart'
import { DAILY_NORMALIZED, CUMULATIVE, YOY_CHANGE } from './consts'

const d3 = require('d3')

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      quarter: 1,
      type: DAILY_NORMALIZED,
    }
    this.state.data = this.initializeData(props.data)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState(
        Object.assign({}, this.state, {data: this.initializeData(this.nextProps.data)})
      )
    }
  }

  initializeData(data) {
    let quarters = []
    // filter quarter
    // data = data.filter((d) => {
    //   return d['fiscal.quarter'] === this.state.quarter
    // })
    data.forEach((d) => {
      if (!quarters[d['fiscal.quarter']-1]) {
        quarters[d['fiscal.quarter']-1] = [d]
      } else {
        quarters[d['fiscal.quarter']-1].push(d)
      }
    })

    quarters = quarters.map((data) => {
      // sort by date
      data = data.sort((a, b) => a.date - b.date)

      // get range of car count
      let carCountRange = d3.extent(data, (d) => d['car.count'])

      // group by year
      data = data.reduce((res, d) => {
        if (!res[d['fiscal.year']]) res[d['fiscal.year']] = []
        res[d['fiscal.year']].push(d)
        return res
      }, {})

      data = this.addStatsToData(data)
      return data
    })
    return quarters
  }

  onClickQuarter(q) {
    this.setState(
      Object.assign({}, this.state, {quarter: q})
    )
  }

  getMaxDaysInQuarter(data) {
    let max = 0
    Object.keys(data).forEach((year) => {
      if (data[year].length > max) max = data[year].length
    })
    return max
  }

  onClickSelectGraph(type) {
    this.setState(
      Object.assign({}, this.state, {type: type})
    )
  }

  getMinYear(data) {
    return Object.keys(data).sort((a,b) => a - b)[0]
  }

  addStatsToData(data) {
    // add daily normalized and x
    Object.keys(data).forEach((year) => {
      data[year] = data[year].map((d, i) => {
        d.x = i
        d.dailyNormalized = d['car.count']
        return d
      })
    })
    // add cumulative
    Object.keys(data).forEach((year) => {
      data[year] = data[year].map((d, i, arr) => {
        d.x = i
        if (i === 0) {
          d.cumulative = d['car.count']
        } else {
          d.cumulative = d['car.count'] + arr[i-1].cumulative
        }
        return d
      })
    })
    // yoy change
    Object.keys(data).forEach((year) => {
      data[year] = data[year].map((d, i, arr) => {
        if (year == this.getMinYear(data)) {
          d.yoyChange = 0
        } else if (data[year-1][i]) {
          d.yoyChange = d.cumulative - data[year-1][i].cumulative
        }
        return d
      })
    })
    return data
  }

  getMaxProp(data, prop) {
    let max = 0
    Object.keys(data).forEach((year) => {
      data[year].forEach((d) => {
        if (d[prop] > max) max = d[prop]
      })
    })
    return max
  }

  getMinProp(data, prop) {
    let min = 0
    Object.keys(data).forEach((year) => {
      data[year].forEach((d) => {
        if (d[prop] < min) min = d[prop]
      })
    })
    return min
  }

  render() {

    let { padding, width, height } = this.props
    let data = this.state.data[this.state.quarter-1]

    let xProp, yProp
    switch (this.state.type) {
        case DAILY_NORMALIZED:
            xProp = 'x'
            yProp = 'dailyNormalized'
            break
        case CUMULATIVE:
            xProp = 'x'
            yProp = 'cumulative'
            break
        case YOY_CHANGE:
            xProp = 'x'
            yProp = 'yoyChange'
            break
        default:
            xProp = 'x'
            yProp = 'dailyNormalized'
    }

    let x = d3.scaleLinear().range([padding, width - padding])
      .domain([0, this.getMaxDaysInQuarter(data)])
    let y = d3.scaleLinear().range([height-padding, padding])
      .domain([this.getMinProp(data, yProp), this.getMaxProp(data, yProp)])


    return (
      <div>
        <LineChart width={width} height={height} data={data}
          xScale={x} yScale={y} padding={padding} xProp={xProp} yProp={yProp}/>
        <div style={{display: 'flex'}}>
          <div style={{flexBasis: '50%'}}>
            {[1,2,3,4].map((q) => {
              return <button key={q} onClick={()=>this.onClickQuarter(q)}>Quarter {q}</button>
            })}
          </div>
          <div style={{flexBasis: '50%'}}>
            <button onClick={()=>this.onClickSelectGraph(DAILY_NORMALIZED)}>Daily Normalized Car Counts</button>
            <button onClick={()=>this.onClickSelectGraph(CUMULATIVE)}>Cumulative Car Counts</button>
            <button onClick={()=>this.onClickSelectGraph(YOY_CHANGE)}>YoY Change in Car Counts</button>
          </div>
        </div>
      </div>
    );
  }
}

App.PropTypes = {
  data: PropTypes.Object,
  padding: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number
}

export default App;
