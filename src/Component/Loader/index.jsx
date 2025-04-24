import React from 'react'
import "./Loader.css";
function Loader({color}) {
  return <div className="loader" style={{'--loader-color':color}}></div>;
}

export default Loader