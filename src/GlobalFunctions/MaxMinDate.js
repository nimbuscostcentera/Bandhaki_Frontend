import React from 'react'

function MaxMinDate(age) {
 var currentDate = new Date();
  var mindate = currentDate.getFullYear()-age;
    var year = mindate;
  var month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  var day = String(currentDate.getDate()).padStart(2, "0");
var formatteddate = `${year}-${month}-${day}`;
  return formatteddate;
}

export default MaxMinDate