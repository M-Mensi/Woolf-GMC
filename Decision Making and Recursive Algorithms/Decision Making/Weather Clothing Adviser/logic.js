
function getClothingAdvice(temperatureCelsius, isRaining) {
  if (
    typeof temperatureCelsius !== "number" ||
    Number.isNaN(temperatureCelsius)
  ) {
    console.log("temperature must be a number");
    return null;
  }
  if (typeof isRaining !== "boolean") {
    console.log("isRaining must be a boolean");
    return null;
  }

  const clothes = [];

  if (temperatureCelsius <= 0) {
    clothes.push("heavy coat", "hat", "gloves");
  } else if (temperatureCelsius <= 12) {
    clothes.push("coat or jacket", "long sleeves");
  } else if (temperatureCelsius <= 22) {
    clothes.push("light jacket or sweater");
  } else {
    clothes.push("t-shirt or short sleeves");
  }

  if (isRaining) {
    clothes.push("rain jacket or umbrella");
  }

  return `Recommended: ${clothes.join(", ")}.`;
}