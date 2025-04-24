import React from "react";
import MaxLengthofID from "./MaxLengthofID";

function PassportValidation(num) {
  var isNum = /^[A-PR-WY-Z][1-9]\d\s?\d{4}[1-9]$/;
  //console.log(num,"pass");
  var Num = isNum.test(num);
  if (Num) {
    return true;
  } else {
    return false;
  } //console.log(Num, "I AM IN GLOBAL");
}
 
export default PassportValidation;

{/*
1.It should be eight characters long.
2.The first character should be an uppercase alphabet.excluding Q,X
3.The next two characters should be a number, but the second character should be any number from 1-9
and the third character should be any number from 0-9.
4.fourth should be zero or one white space character.
5.The next four characters should be any number from 0-9.
6.The last character should be any number from 1-9.
*/}