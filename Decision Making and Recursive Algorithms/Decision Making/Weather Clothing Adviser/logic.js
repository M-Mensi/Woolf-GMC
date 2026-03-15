/**
 * Returns clothing advice based on temperature and whether it is raining.
 *
 * @param {number} temperatureCelsius
 * @param {boolean} isRaining
 * @returns {string}
 */
function getClothingAdvice(temperatureCelsius, isRaining) {
  if (
    typeof temperatureCelsius !== "number" ||
    Number.isNaN(temperatureCelsius)
  ) {
    throw new TypeError("temperature must be a number");
  }
  if (typeof isRaining !== "boolean") {
    throw new TypeError("isRaining must be a boolean");
  }

  const layers = [];

  if (temperatureCelsius <= 0) {
    layers.push("heavy coat", "hat", "gloves");
  } else if (temperatureCelsius <= 12) {
    layers.push("coat or jacket", "long sleeves");
  } else if (temperatureCelsius <= 22) {
    layers.push("light jacket or sweater");
  } else {
    layers.push("t-shirt or short sleeves");
  }

  if (isRaining) {
    layers.push("rain jacket or umbrella");
  }

  return `Recommended: ${layers.join(", ")}.`;
}

module.exports = { getClothingAdvice };
