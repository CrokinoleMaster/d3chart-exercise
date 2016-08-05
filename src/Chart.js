import React, { PropTypes } from 'react'

let Chart = function(props) {
  return (
    <svg {...props}></svg>
  )
}

Chart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}

export default Chart
