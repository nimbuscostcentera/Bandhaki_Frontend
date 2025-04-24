function AlphabetOnly(alph) {
 var isAlpha = /^[a-zA-Z][a-zA-Z ]*$/;
 var res = isAlpha.test(alph);
 if(res){
    return true
 }
 else{
    return false
 }
}

export default AlphabetOnly;
