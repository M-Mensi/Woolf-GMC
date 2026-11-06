function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function iterateWithAsyncAwait(values) {
  for (let index = 0; index < values.length; index += 1) {
    console.log(values[index]);
    if (index < values.length - 1) {
      await delay(1000);
    }
  }
}

async function simulateApiCall() {
  await delay(1000);
  return { message: "Data fetched successfully" };
}

async function awaitCall(apiCall = simulateApiCall) {
  try {
    const data = await apiCall();
    console.log(data);
    return data;
  } catch {
    console.error("Unable to fetch data. Please try again later.");
  }
}

async function firstAsyncFunction() {
  await delay(1000);
  console.log("First async function complete");
}

async function secondAsyncFunction() {
  await delay(1000);
  console.log("Second async function complete");
}

async function thirdAsyncFunction() {
  await delay(1000);
  console.log("Third async function complete");
}

async function chainedAsyncFunctions() {
  await firstAsyncFunction();
  await secondAsyncFunction();
  await thirdAsyncFunction();
}

if (require.main === module) {
  (async () => {
    await iterateWithAsyncAwait(["First value", "Second value", "Third value"]);
    await awaitCall();
    await chainedAsyncFunctions();
  })();
}

module.exports = {
  awaitCall,
  chainedAsyncFunctions,
  firstAsyncFunction,
  iterateWithAsyncAwait,
  secondAsyncFunction,
  simulateApiCall,
  thirdAsyncFunction,
};
