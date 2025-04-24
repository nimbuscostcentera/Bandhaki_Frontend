import React from 'react'

function DrivingLicenceValidation(votercard) {
  var vot = /^[A-Z]{2}[0-9]{2}[\s-]{1}[0-9]{13}$/;
  var VotVal = vot.test(votercard);
  if (VotVal) {
    return true;
  } else {
    return false;
  }
}

export default DrivingLicenceValidation;
{
  /**
The first two characters should be upper-case alphabets that represent the state code.
The next two characters should be digits that represent the RTO code.
The next four characters should be digits that represent the license issued in a year.
The next seven characters should be any digits from 0-9.
*/
}