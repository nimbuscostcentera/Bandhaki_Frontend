import React from "react";

function PhnoValidation(args) {
  var isNum = /^[6-9][0-9]{9}$/;
  var Num = isNum.test(args);
  if (Num) {
    return true;
  } else {
    return false;
  }
}

export default PhnoValidation;
{
  /**
1.The first digit should contain numbers between 6 to 9.
2.The rest 9 digit can contain any number between 0 to 9.
3.The mobile number can have 11 digits also by including 0 at the starting.
4.The mobile number can be of 12 digits also by including 91 at the starting
*/
}