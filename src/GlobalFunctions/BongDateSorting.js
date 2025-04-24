function BongDateSorting(order, Array, field) {
  //console.log(order,"")
  const sortedArray = [...Array];
  if (order === "Asc") {
    sortedArray.sort((a, b) => {
      let sdate = parseInt(a[field].toString().replace(/-/g, ""), 10); 
      let edate = parseInt(b[field].toString().replace(/-/g, ""), 10);
      return sdate - edate;
    });
  } else if (order === "Desc") {
    sortedArray.sort((a, b) => {
      let sdate =parseInt( a[field].toString().replace(/-/g, ""), 10);;
      let edate = parseInt(b[field].toString().replace(/-/g, ""), 10);;
      return edate - sdate;
    });
  }
  return sortedArray;
}

export default BongDateSorting;