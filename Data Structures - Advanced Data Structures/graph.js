// Graph implementation using adjacency list
class Graph {
  constructor(directed = false) {
    this.adj = new Map(); // vertex -> Set(neighbors)
    this.directed = directed;
  }

  addVertex(v) {
    if (!this.adj.has(v)) this.adj.set(v, new Set());
  }

  addEdge(u, v) {
    this.addVertex(u);
    this.addVertex(v);
    this.adj.get(u).add(v);
    if (!this.directed) this.adj.get(v).add(u);
  }

  removeEdge(u, v) {
    if (!this.adj.has(u)) return false;
    const removed = this.adj.get(u).delete(v);
    if (!this.directed && this.adj.has(v)) this.adj.get(v).delete(u);
    return removed;
  }

  hasEdge(u, v) {
    return this.adj.has(u) && this.adj.get(u).has(v);
  }

  printGraph() {
    console.log(`Graph (directed=${this.directed}):`);
    for (const [v, neighbors] of this.adj) {
      console.log(`  ${v} -> ${[...neighbors].join(', ')}`);
    }
  }

  // Depth-First Search (iterative)
  dfs(start) {
    const visited = new Set();
    const order = [];
    const stack = [start];

    while (stack.length) {
      const v = stack.pop();
      if (!this.adj.has(v) || visited.has(v)) continue;
      visited.add(v);
      order.push(v);
      // push neighbors in reverse iteration order to visit in natural order
      const neighbors = [...this.adj.get(v)];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const nb = neighbors[i];
        if (!visited.has(nb)) stack.push(nb);
      }
    }

    console.log('DFS order:', order.join(' '));
    return order;
  }

  // Breadth-First Search
  bfs(start) {
    const visited = new Set();
    const order = [];
    const queue = [];

    if (!this.adj.has(start)) return order;

    queue.push(start);
    visited.add(start);

    while (queue.length) {
      const v = queue.shift();
      order.push(v);
      for (const nb of this.adj.get(v)) {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      }
    }

    console.log('BFS order:', order.join(' '));
    return order;
  }
}

// --- Tests ---
(function runTests() {
  console.log('\n--- Undirected Graph Test ---');
  const g = new Graph(false);
  // add edges (will create vertices implicitly)
  g.addEdge('A', 'B');
  g.addEdge('A', 'C');
  g.addEdge('B', 'C');
  g.addEdge('C', 'D');

  g.printGraph();

  // Traversals starting from 'A'
  g.dfs('A');
  g.bfs('A');

  console.log('\nHas edge A-B?', g.hasEdge('A', 'B'));
  console.log('Remove edge A-B ->', g.removeEdge('A', 'B'));
  console.log('Has edge A-B?', g.hasEdge('A', 'B'));
  g.printGraph();

  console.log('\n--- Directed Graph Test ---');
  const dg = new Graph(true);
  dg.addEdge(1, 2);
  dg.addEdge(1, 3);
  dg.addEdge(2, 3);
  dg.addEdge(3, 1);

  dg.printGraph();
  dg.dfs(1);
  dg.bfs(1);

  console.log('\nTests completed.');
})();

module.exports = Graph;
