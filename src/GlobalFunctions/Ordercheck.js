// const Ordercheck = (array, field) => {
//   // let isAscending = true;
//   let isDescending = true;

//   for (let i = 0; i < array.length - 1; i++) {
//     const a = (array[i][field] || "").trim().toLowerCase();
//     const b = (array[i + 1][field] || "").trim().toLowerCase();

//     // if (a > b) isAscending = false;
//     if (a < b) isDescending = false;
//   }

//   return isDescending ? "Desc" : "Asc";
// };

const Ordercheck = (array, field) => {
  let isAscending = true;
  let isDescending = true;

  for (let i = 0; i < array.length - 1; i++) {
    let a = array[i][field];
    let b = array[i + 1][field];

    // Handle both numbers and strings
    if (typeof a === "string") a = a.trim().toLowerCase();
    if (typeof b === "string") b = b.trim().toLowerCase();
    if (a > b) isAscending = false;
    if (a < b) isDescending = false;
  }

  return isDescending ? "Desc" : "Asc";
};

export default Ordercheck;
