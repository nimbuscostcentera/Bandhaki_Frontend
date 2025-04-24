export default function SortArrayByNumber(order, Array, field) {
  const sortedArray=[...Array]
  if (order === "Asc") {
    sortedArray.sort((a, b) => a[field] - b[field]);
  } else if (order === "Desc") {
    sortedArray.sort((a, b) => b[field] - a[field]);
  }
  return sortedArray
}