import moment from "moment";
// function SortArrayByString(order, Array, field) {
//   //console.log(order,Array,field,"sortarraybystring")
//   const sortedArray = [...Array];
//   if (order === "Asc") {
//     sortedArray.sort((a, b) => a[field].localeCompare(b[field]));
//   } else if (order === "Desc") {
//     sortedArray.sort((a, b) => b[field].localeCompare(a[field]));
//   }
//   return sortedArray
// }

const SortArrayByString = (order, data, field) => {
  return [...data].sort((a, b) => {
    const textA = (a[field] || "").trim().toLowerCase();
    const textB = (b[field] || "").trim().toLowerCase();

    return order === "Asc"
      ? textA.localeCompare(textB)
      : textB.localeCompare(textA);
  });
};

export default SortArrayByString;