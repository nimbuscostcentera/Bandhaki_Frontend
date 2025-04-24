const SortArrayByTime = (order, data, field) => {
    let arr = [];
 if(order === "Asc"){
    arr=  data.sort((a, b) => {
        let stime = parseInt(a[field].toString().replace(/:/g, ""), 10);
        let etime = parseInt(b[field].toString().replace(/:/g, ""), 10);
        console.log(stime, etime);
        return stime - etime;
    });
     console.log(arr)
 } else if (order === "Desc") {
 arr= data.sort((a, b) => {
        let stime = parseInt(a[field].toString().replace(/:/g, ""), 10);
     let etime = parseInt(b[field].toString().replace(/:/g, ""), 10);
       console.log(stime, etime);
       return etime - stime;
 });
      console.log(arr);
    }
    return arr;
};
export default SortArrayByTime