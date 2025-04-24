import React from 'react'

function VoterCardValidation(params) {
  var vot = /^[A-Z]{3}[0-9]{7}?$/;
  var votVal = vot.test(params);
  // //console.log(votVal,"I AM IN GLOBAL");
  if (votVal) {
    return true;
  } else {
    return false;
  }
}

export default VoterCardValidation