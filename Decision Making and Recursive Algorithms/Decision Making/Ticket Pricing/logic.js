function ticketPrice(age) {
  if (typeof age !== "number" || !Number.isInteger(age) || age < 0) {
    console.log("age must be non-negative");
    return null;
  }

  if (age <= 12) return 10;
  if (age <= 17) return 15;
  return 20;
}