const { primMST } = require("./minimumSpanningTree");

// Example graph (nodes represent computers, weights represent cable cost)
const nodes = ["A", "B", "C", "D", "E"];
const edges = [
  { u: "A", v: "B", weight: 4 },
  { u: "A", v: "C", weight: 2 },
  { u: "B", v: "C", weight: 1 },
  { u: "B", v: "D", weight: 5 },
  { u: "C", v: "D", weight: 8 },
  { u: "C", v: "E", weight: 10 },
  { u: "D", v: "E", weight: 2 },
];

const prim = primMST(nodes, edges);
console.log("Selected edges:", prim.mst);
console.log("Total cost:", prim.totalCost);
