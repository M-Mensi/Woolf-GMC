
function isLeapYear(year) {
  if (typeof year !== "number" || !Number.isInteger(year)) {
    console.log("year must be an integer");
    return false;
  }

  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}