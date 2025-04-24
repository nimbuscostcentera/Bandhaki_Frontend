import React, { useState } from "react";
function PasswordValidation(Password) {
  // var [Error, setError] = useState([]);
  // var err = [];
  // var errmsg1 = "";
  // var errmsg2 = "";
  // var errmsg3 = "";
  // var errmsg4 = "";
  // var errmsg5 = "";
  // var Status, msg;
  var isNum = /\d/;
  var Num = isNum.test(Password);
  var isUpper = /[A-Z]/;
  var Upper = isUpper.test(Password);
  var isLower = /[a-z]/;
  var Lower = isLower.test(Password);
  var isSpecial = /[!@#$%^&*_+|:<>?]/;
  var Special = isSpecial.test(Password);
  var isSpace = /\s/;
  var Space = isSpace.test(Password);

  // //console.log(Num + " " + Upper + " " + Lower + " " + Special + " " + Space);

  if (Num && Upper && Lower && Special && !Space === true) {
    return true;
  } else {
    return false;
  }
  // else{
  //   if (Num === false) {
  //     errmsg1 = "Password should have atleast 1 number";
  //     err.push(errmsg1);
  //   }
  //   if (Upper === false) {
  //     errmsg2 = "Password should have atleast 1 Upper case character";
  //     err.push(errmsg2);
  //   }
  //   if (Lower === false) {
  //     errmsg3 = "Password should have atleast 1 Lower case character";
  //     err.push(errmsg3);
  //   }
  //   if (Special === false) {
  //     errmsg4 = "Password should have atleast 1 Special character";
  //     err.push(errmsg4);
  //   }
  //   if (Space === true) {
  //     errmsg5 = "Password should not have any Space";
  //     err.push(errmsg5);
  //   }
  //   setError(err);}

  // var pass = /^[A-Za-z0-9!@#$%^&*?_\/\-\.\\]*$/;
  // var res = pass.test(Password);
  // if (res) {
  //   return true;
  // } else {
  //   return false;
  // }
}

export default PasswordValidation;
