function ExecutiveCode(params) {
  var isExc = /^[A-Za-z 0-9][A-Za-z 0-9\-]*$/;
  var resp = isExc.test(params);
  //console.log(resp);
  if (resp) {
    return true;
  } else {
    return false;
  }
}

export default ExecutiveCode;
