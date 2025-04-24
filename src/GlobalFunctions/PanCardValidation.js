import React from 'react'

function PanCardValidation(panNo) {
   var pan = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
   var PanVal = pan.test(panNo);
   if (PanVal) {
     return true;
   } else {
     return false;
   }
}

export default PanCardValidation;
{
  /**
It should be ten characters long.
The first five characters should be any upper case alphabets.
The next four-characters should be any number from 0 to 9.
The last(tenth) character should be any upper case alphabet.
It should not contain any white spaces.
*/
}