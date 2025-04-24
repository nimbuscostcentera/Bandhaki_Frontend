
function EmailValidation(email) {
  var isMail = /^[A-Za-z][\w-\.]+@+([\w-]+\.)+[\w-]{2,4}$/;
  var resp = isMail.test(email);
  //console.log(resp);
  if (resp) {
    return true;
  } else {
    return false;
  }
}

export default EmailValidation;
