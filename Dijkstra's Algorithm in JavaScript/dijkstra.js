
function dijkstra(graph, start) {
    // Initialize distances with Infinity, except start set to 0
    const distances = {};
    const visited = new Set();
    const vertices = Object.keys(graph);

    for (let vertex of vertices) {
        distances[vertex] = Infinity;
    }
    distances[start] = 0;

    while (visited.size < vertices.length) {
        // Find the unvisited vertex with the smallest known distance
        let minVertex = null;
        let minDistance = Infinity;

        for (let vertex of vertices) {
            if (!visited.has(vertex) && distances[vertex] < minDistance) {
                minVertex = vertex;
                minDistance = distances[vertex];
            }
        }

        visited.add(minVertex);

        // Update distances to neighbors of minVertex
        const neighbors = graph[minVertex];
        for (let neighbor in neighbors) {
            if (!visited.has(neighbor)) {
                const newDist = distances[minVertex] + neighbors[neighbor];
                if (newDist < distances[neighbor]) {
                    distances[neighbor] = newDist;
                }
            }
        }
    }

    return distances;
}

// Example usage:
const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'A': 4, 'C': 5, 'D': 10 },
    'C': { 'A': 2, 'B': 5, 'D': 3 },
    'D': { 'B': 10, 'C': 3 }
};

console.log(dijkstra(graph, 'A'));