import React from "react";

function GSTINValidation(gstin) {
  var GST = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/ ;
  var PanVal = GST.test(gstin);
  if (PanVal) {
    return true;
  } else {
    return false;
  }
}

export default GSTINValidation;
