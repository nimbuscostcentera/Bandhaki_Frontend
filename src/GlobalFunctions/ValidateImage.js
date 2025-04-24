import React, { useState } from "react";

function ValidateImage(e) {
  var photovalmsg = "";
  var imgbool = false;
  var max = 1024 * 1024 * 2;
  // //console.log(e);
  if (e !== null && e.files.length > 0) {
    var fileSize = e.files[0].size;
    if (fileSize > max) {
      photovalmsg = "Image size exceeded";
      imgbool = true;
    }
  } else {
    imgbool = false;
    photovalmsg = "";
  }

  return [photovalmsg, imgbool];
}

export default ValidateImage;
