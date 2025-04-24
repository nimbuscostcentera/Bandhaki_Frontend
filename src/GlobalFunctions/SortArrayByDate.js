import moment from "moment";
function SortArrayByDate(order, Array, field) {
  //console.log(order,"")
  const sortedArray = [...Array];
  if (order === "Asc") {
    sortedArray.sort((a, b) => {
      let sdate = moment(a[field]);
      let edate = moment(b[field]);
      return sdate.diff(edate);
    });
  } else if (order === "Desc") {
    sortedArray.sort((a, b) => {
      let sdate = moment(a[field]);
      let edate = moment(b[field]);
      return edate.diff(sdate);
    });
  }
  return sortedArray;
}

export default SortArrayByDate