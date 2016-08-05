import React, { PropTypes } from 'react'


let Line = function(props) {
  return (
    <path d={props.path} stroke={props.color}
      strokeWidth={props.width} fill='none' />
  )
}

Line.defaultProps = {
  path: '',
  color: 'blue',
  width: 2
}

Line.propTypes = {
  path: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.number
}

export default Line
