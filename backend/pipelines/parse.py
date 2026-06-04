"""
parse.py - Pipeline Structure and DAG Validation
Contains algorithms to evaluate if the graph structure contains cycles.
"""

def is_dag(nodes, edges) -> bool:
  """
  Determines if a graph represented by nodes and edges is a Directed Acyclic Graph (DAG).
  Uses Depth-First Search (DFS) with recursion stack tracking to detect cycles.
  
  :param nodes: List of node dictionaries.
  :param edges: List of edge dictionaries.
  :return: True if the graph is a DAG, False if it contains at least one cycle.
  """
  # Build adjacency list from node definitions
  adjacency = {}
  for node in nodes:
    node_id = node.get('id')
    if node_id:
      adjacency[node_id] = []

  # Populate adjacency list with directed edges
  for edge in edges:
    source = edge.get('source')
    target = edge.get('target')
    
    # Safely append edge paths if nodes exist in adjacency table
    if source in adjacency and target in adjacency:
      adjacency[source].append(target)

  visited = set()
  rec_stack = set()

  def dfs(node_id) -> bool:
    if node_id in rec_stack:
      return True  # Cycle detected
    if node_id in visited:
      return False

    visited.add(node_id)
    rec_stack.add(node_id)

    for neighbor in adjacency.get(node_id, []):
      if dfs(neighbor):
        return True

    rec_stack.remove(node_id)
    return False

  # Run DFS on all unvisited nodes
  for node in nodes:
    node_id = node.get('id')
    if node_id and node_id not in visited:
      if dfs(node_id):
        return False  # Contains a cycle, therefore not a DAG

  return True
