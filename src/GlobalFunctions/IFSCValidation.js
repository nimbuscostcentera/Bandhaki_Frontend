import React from 'react'

function IFSCValidation(ifsc) {
    var reg = /^([A-Z]){4}0([A-Z0-9]){6}?$/;
    var res = reg.test(ifsc);
    if (res)
    {
        return true
    }
    else {
        return false; 
    }

}

export default IFSCValidation