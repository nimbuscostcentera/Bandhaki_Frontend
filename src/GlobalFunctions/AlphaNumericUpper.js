function AlphaNumericUpper(params) {
  var isMail = /^[A-Z0-9]*$/;
  var resp = isMail.test(params);
  //console.log(resp);
  if (resp) {
    return true;
  } else {
    return false;
  }
}

export default AlphaNumericUpper
