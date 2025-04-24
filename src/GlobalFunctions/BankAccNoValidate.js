import React from 'react'

function BankAccNoValidate(num) {
  var isNum = /^[0-9][0-9]{9,18}$/;
  var Num = isNum.test(num);
  if (Num) {
    return true;
  } else {
    return false;
  }
}

export default BankAccNoValidate