const { createHash } = require("node:crypto");

class DistributedStore {
  constructor(nodes = ["node-a", "node-b", "node-c"], replicas = 2) {
    this.replicas = replicas;
    this.nodes = new Map(nodes.map((id) => [id, { up: true, data: new Map() }]));
    this.cache = new Map();
    this.buildRing();
  }

  hash(value) {
    return createHash("sha256").update(value).digest().readUInt32BE(0);
  }

  // Virtual nodes spread each physical node around the ring.
  buildRing() {
    this.ring = [...this.nodes.keys()]
      .flatMap((id) =>
        Array.from({ length: 100 }, (_, i) => ({
          id,
          hash: this.hash(`${id}:${i}`),
        }))
      )
      .sort((a, b) => a.hash - b.hash);
  }

  owners(key) {
    if (!this.ring.length) return [];
    const hash = this.hash(key);
    let start = this.ring.findIndex((point) => point.hash >= hash);
    if (start < 0) start = 0;
    const owners = [];
    for (let i = 0; i < this.ring.length && owners.length < this.replicas; i++) {
      const id = this.ring[(start + i) % this.ring.length].id;
      if (!owners.includes(id)) owners.push(id);
    }
    return owners;
  }

  snapshot() {
    const data = new Map();
    for (const [id, node] of this.nodes) {
      if (node.up) {
        for (const [key, value] of node.data) {
          if (!data.has(key)) data.set(key, { value, owners: this.owners(key) });
        }
      }
    }
    return data;
  }

  rebalance(data) {
    for (const node of this.nodes.values()) if (node.up) node.data.clear();
    this.cache.clear();
    let moved = 0;
    for (const [key, entry] of data) {
      const owners = this.owners(key);
      if (owners.some((id) => !entry.owners.includes(id)) ||
          entry.owners.some((id) => !owners.includes(id))) moved++;
      for (const id of owners) {
        const node = this.nodes.get(id);
        if (node?.up) node.data.set(key, entry.value);
      }
    }
    return moved;
  }

  // Rebuild ownership when a node joins or leaves; report keys whose replicas change.
  addNode(id) {
    if (this.nodes.has(id)) throw new Error(`Node already exists: ${id}`);
    const data = this.snapshot();
    this.nodes.set(id, { up: true, data: new Map() });
    this.buildRing();
    return this.rebalance(data);
  }

  removeNode(id) {
    if (!this.nodes.has(id)) throw new Error(`Node not found: ${id}`);
    const data = this.snapshot();
    this.nodes.delete(id);
    this.buildRing();
    return this.rebalance(data);
  }

  setNodeAvailable(id, up) {
    const node = this.nodes.get(id);
    if (!node) throw new Error(`Node not found: ${id}`);
    if (node.up === up) return;
    if (!up) {
      node.up = false;
      this.cache.clear();
      return;
    }
    const data = this.snapshot();
    node.up = true;
    node.data.clear();
    this.rebalance(data);
  }

  put(key, value) {
    const owners = this.owners(key);
    let saved = false;
    for (const id of owners) {
      const node = this.nodes.get(id);
      if (node?.up) {
        node.data.set(key, value);
        saved = true;
      }
    }
    if (!saved) throw new Error(`No available node for key: ${key}`);
    this.cache.set(key, { value, expires: Date.now() + 5000 });
    while (this.cache.size > 100) this.cache.delete(this.cache.keys().next().value);
    return value;
  }

  get(key) {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      this.cache.delete(key);
      this.cache.set(key, cached);
      return cached.value;
    }
    this.cache.delete(key);
    let available = false;
    for (const id of this.owners(key)) {
      const node = this.nodes.get(id);
      if (!node?.up) continue;
      available = true;
      if (node.data.has(key)) return this.put(key, node.data.get(key));
    }
    if (!available) throw new Error(`No available node for key: ${key}`);
    return undefined;
  }

  delete(key) {
    let deleted = false;
    for (const id of this.owners(key)) {
      const node = this.nodes.get(id);
      if (node?.up) deleted = node.data.delete(key) || deleted;
    }
    this.cache.delete(key);
    return deleted;
  }
}

module.exports = { DistributedStore };

if (require.main === module) {
  const store = new DistributedStore();
  const users = {
    "user:101": { name: "Alice" },
    "user:102": { name: "Bob" },
    "user:103": { name: "Charlie" },
    "user:104": { name: "Diana" },
    "user:105": { name: "Eve" },
    "user:106": { name: "Frank" },
  };
  for (const [key, value] of Object.entries(users)) store.put(key, value);

  const node = [...store.nodes].find(([, value]) => value.data.has("user:101"))[0];
  store.setNodeAvailable(node, false);
  console.log("Read during node failure:", store.get("user:101"));
  store.setNodeAvailable(node, true);
  console.log("Keys moved on node join:", store.addNode("node-d"));
  console.log("Read user:102:", store.get("user:102"));
  console.log("Keys moved on node leave:", store.removeNode("node-d"));
}
