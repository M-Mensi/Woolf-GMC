// Minimum Spanning Tree algorithm (Prim)
// Supports a simple edge list representation: { u, v, weight }

function buildAdjacencyList(nodes, edges) {
  const adj = new Map();
  nodes.forEach((n) => adj.set(n, []));
  edges.forEach((edge) => {
    const { u, v, weight } = edge;
    if (!adj.has(u) || !adj.has(v)) {
      console.log("Edge contains unknown vertex");
    }
    adj.get(u).push({ node: v, weight, edge });
    adj.get(v).push({ node: u, weight, edge });
  });
  return adj;
}

// Simple min-heap for Prim's algorithm
class MinHeap {
  constructor() {
    this.heap = [];
  }

  _parent(i) {
    return Math.floor((i - 1) / 2);
  }

  _left(i) {
    return 2 * i + 1;
  }

  _right(i) {
    return 2 * i + 2;
  }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  push(item) {
    this.heap.push(item);
    this._siftUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  _siftUp(i) {
    while (i > 0) {
      const p = this._parent(i);
      if (this.heap[i].weight < this.heap[p].weight) {
        this._swap(i, p);
        i = p;
      } else {
        break;
      }
    }
  }

  _siftDown(i) {
    const n = this.heap.length;
    while (true) {
      const l = this._left(i);
      const r = this._right(i);
      let smallest = i;
      if (l < n && this.heap[l].weight < this.heap[smallest].weight) {
        smallest = l;
      }
      if (r < n && this.heap[r].weight < this.heap[smallest].weight) {
        smallest = r;
      }
      if (smallest !== i) {
        this._swap(i, smallest);
        i = smallest;
      } else {
        break;
      }
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

function primMST(nodes, edges, start = null) {
  if (nodes.length === 0) {
    return { mst: [], totalCost: 0 };
  }

  const adj = buildAdjacencyList(nodes, edges);
  const visited = new Set();
  const mst = [];
  let totalCost = 0;
  const priorityQueue = new MinHeap();

  const startNode = start !== null ? start : nodes[0];
  visited.add(startNode);

  // Add all edges from start node into PQ
  adj.get(startNode).forEach((item) => {
    priorityQueue.push({ from: startNode, to: item.node, weight: item.weight });
  });

  while (!priorityQueue.isEmpty() && visited.size < nodes.length) {
    const { from, to, weight } = priorityQueue.pop();
    if (visited.has(to)) continue;
    visited.add(to);
    mst.push({ u: from, v: to, weight });
    totalCost += weight;

    adj.get(to).forEach((item) => {
      if (!visited.has(item.node)) {
        priorityQueue.push({ from: to, to: item.node, weight: item.weight });
      }
    });
  }

  return { mst, totalCost };
}

module.exports = {
  primMST,
};
