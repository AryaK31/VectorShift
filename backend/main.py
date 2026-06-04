from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pipelines.parse import is_dag

app = FastAPI()

# Add CORS Middleware to allow requests from the React frontend port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(request: dict):
    # Validate request structure
    if not isinstance(request, dict):
        raise HTTPException(status_code=400, detail="Malformed JSON structure. Expected a dictionary object.")
    
    nodes = request.get('nodes', [])
    edges = request.get('edges', [])

    if not isinstance(nodes, list) or not isinstance(edges, list):
        raise HTTPException(status_code=400, detail="nodes and edges parameters must be JSON arrays.")

    # Edge case: Empty graph
    if not nodes and not edges:
        return {
            "num_nodes": 0,
            "num_edges": 0,
            "is_dag": True
        }

    # Validate node structure and gather all unique node IDs
    node_ids = set()
    for idx, node in enumerate(nodes):
        if not isinstance(node, dict) or 'id' not in node:
            raise HTTPException(
                status_code=400,
                detail=f"Node at index {idx} is malformed. Nodes must be objects containing an 'id' key."
            )
        node_ids.add(node['id'])

    # Validate edge structure and check for non-existent node references
    for idx, edge in enumerate(edges):
        if not isinstance(edge, dict) or 'source' not in edge or 'target' not in edge:
            raise HTTPException(
                status_code=400,
                detail=f"Edge at index {idx} is malformed. Edges must be objects containing 'source' and 'target' keys."
            )
        
        source = edge['source']
        target = edge['target']
        
        # Verify node references exist
        if source not in node_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Edge at index {idx} references non-existent source node: '{source}'."
            )
        if target not in node_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Edge at index {idx} references non-existent target node: '{target}'."
            )

    # Compute graph metrics and cycle presence
    num_nodes = len(nodes)
    num_edges = len(edges)
    is_dag_graph = is_dag(nodes, edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag_graph
    }
