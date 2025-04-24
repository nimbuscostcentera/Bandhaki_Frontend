import React from 'react'

function AdhaarValidation(num) {
  var isNum = /^[1-9][0-9]{11}$/;
  ////console.log(num,"ami ekhane");
  var Num = isNum.test(num);
  if (Num) {
    return true;
  } else {
    return false;
  }
}

export default AdhaarValidation;