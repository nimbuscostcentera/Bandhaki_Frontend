import React,{useState} from 'react'

function MaxLengthofID(IdProofType) {
  const [maxlen, setMaxlen] = useState(0);

  if (IdProofType === "Aadhaar Card") {
    setMaxlen(12);
  } else if (IdProofType === "Voter Card") {
    setMaxlen(12);
  } else if (IdProofType === "Passport") {
    setMaxlen(45);
  } else if (IdProofType === "Driving Licence") {
    setMaxlen(16);
  } else if (IdProofType === "Pan Card") {
    setMaxlen(10);
  }
  //console.log("maxlen",IdProofType, maxlen);
  return maxlen;
}

export default MaxLengthofID