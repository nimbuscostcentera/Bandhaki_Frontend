import React from "react";
import "./Spiner.css";

function Spiner({ color }) {
  return <div className="Spiner" style={{ "--bg-color": color }}></div>;
}

export default Spiner;
