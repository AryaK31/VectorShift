# VectorShift Pipeline Builder (DAG Orchestrator)

A state-of-the-art, interactive visual node-based workflow builder designed for composing and validating Directed Acyclic Graphs (DAGs) representing complex LLM, prompt, database, loader, and agent chains. 

Built with a **React + React Flow** frontend and a **FastAPI** backend validation microservice, the application allows developers to visually design pipelines, extract variables dynamically, check for topological feedback loops, and retrieve validated graph statistics.

---

## Table of Contents
1. [Key Features](#-key-features)
2. [Visual Design & UX Highlights](#-visual-design--ux-highlights)
3. [Repository Structure](#-repository-structure)
4. [Detailed Node Directory & Schema](#-detailed-node-directory--schema)
5. [How It Works: State Flow & Variable Parsing](#-how-it-works-state-flow--variable-parsing)
6. [Backend Graph & DAG Validation Engine](#-backend-graph--dag-validation-engine)
7. [Installation & Local Deployment](#-installation--local-deployment)
8. [API Endpoints Reference](#-api-endpoints-reference)

---

## Key Features

* **Abstraction-Driven Custom Nodes**: Employs a single configuration-driven base component (`BaseNode.jsx`) that dynamically maps settings, handle layouts, and form fields for **9 separate nodes**.
* **Real-time Variable Extraction**: Text template nodes parse variable declarations inside `{{brackets}}` on-the-fly and dynamically align target (input) handles along the node's left edge.
* **Topological Validation (DAG)**: Submitting a workflow sends a serialized nodes/edges representation to the backend, which parses the network using a Depth-First Search (DFS) algorithm with recursion-stack cycle checks.
* **Visual Loop Indicators**: If a loop exists, the backend marks the canvas state, and the frontend dynamically highlights the cyclical path connections in bold red (`#ef4444`) with running step animations.
* **Resilient CORS & Error Handlers**: Fully handles API fetch errors, FastAPI validation rules, and CORS credentials routing defaults for local development.

---

## Visual Design & UX Highlights

* **Harmony Palette**: Nodes are color-coded by task classification (Input is blue, Output is green, LLM is purple, Text is orange, Prompt is cyan, database/agent is magenta).
* **Smooth Animations & Shadows**: Interactive components use modern hover translations, scaling handle connectors, and micro-transition states.
* **Self-Contained Modals**: Replaces native browser alerts with custom glassmorphic modal overlays providing tabular graph reports, count states, and status flags.
* **Auto-Growing Textareas**: Prompt templates and Text fields grow in height automatically as lines of text are typed to prevent internal node scrollbars.

---

## Repository Structure

```text
VectorShift/
├── README.md                 # Project root workspace documentation
├── backend/                  # FastAPI Web Server
│   ├── pipelines/
│   │   ├── __init__.py
│   │   └── parse.py          # DFS validation routines
│   ├── main.py               # REST controller & CORS middleware
│   └── requirements.txt      # Python dependencies list
└── frontend/                 # React UI Application
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Canvas/       # Grid Workspace container
    │   │   │   ├── Canvas.jsx
    │   │   │   └── Canvas.css
    │   │   ├── SubmitButton/ # Validator controls and Dialog popups
    │   │   │   ├── SubmitButton.jsx
    │   │   │   └── SubmitButton.css
    │   │   └── nodes/        # Base layout abstraction
    │   │       ├── BaseNode.jsx
    │   │       ├── BaseNode.css
    │   │       └── TextNode.jsx
    │   ├── hooks/            # Context hooks & string parsers
    │   │   ├── usePipelineState.js
    │   │   └── useVariableParser.js
    │   ├── nodes/            # 1-to-1 Node wrappers
    │   ├── utils/            # Configurations and Fetch layers
    │   │   ├── api.js
    │   │   └── constants.js
    │   ├── App.js
    │   ├── index.css
    │   ├── index.js
    │   └── store.js          # Zustand store definitions (deprecated)
    └── package.json
```

---

## Detailed Node Directory & Schema

All node configurations are defined inside [constants.js](file:///Users/aryakharwadkar/Downloads/VectorShift/frontend/src/utils/constants.js). The table below documents their handles, state attributes, and default values:

| Node Type | Label | Left Handles (Targets) | Right Handles (Sources) | Input Fields & Forms |
| :--- | :--- | :--- | :--- | :--- |
| **`input`** | Input | None | `value` | **Name** (text, auto-populated), **Type** (select: `Text`, `File`) |
| **`output`** | Output | `value` | None | **Name** (text, auto-populated), **Type** (select: `Text`, `File`) |
| **`llm`** | LLM | `system` (top: 33.3%), `prompt` (top: 66.6%) | `response` | *None (System prompt & Prompt inputs only)* |
| **`text`** | Text | *Dynamic per bracket `{{var}}`* | `output` | **Text** (smooth auto-grow textarea) |
| **`prompt`** | Prompt Template | `template` (top: 33.3%), `variables` (top: 66.6%) | `prompt` | **Template String** (text input; defaults to welcome template) |
| **`url`** | URL Loader | `url` | `data` | **HTTP Method** (select: `GET`, `POST`) |
| **`database`** | Database Connection | None | `queryResult` | **DB Engine** (select: PostgreSQL, MySQL, MongoDB), **SQL Query** (text) |
| **`file`** | File Reader | None | `fileContent` | **File Format** (select: `PDF`, `CSV`, `TXT`) |
| **`agent`** | AI Agent | `instruction` (top: 33.3%), `memory` (top: 66.6%) | `output` | **Model Engine** (select: GPT-4o, Gemini 1.5 Pro, Claude 3.5 Sonnet) |

---

## How It Works: State Flow & Variable Parsing

### 1. Unified State Hook (`usePipelineState.js`)
Rather than relying on non-serializable state functions, the application uses a custom context hook that keeps the canvas data 100% JSON-serializable:
* **Node Addition**: Pre-populates all settings and unique auto-incrementing IDs (`generateID`) directly on creation.
* **Fields Update**: Feeds component updates back into the central canvas hook via the `updateNode` method.
* **React Flow Interface**: Binds standard hooks `onNodesChange`, `onEdgesChange`, and `onConnect` back to the serializable state tables.

### 2. Live Brackets Parsing Regex
The `TextNode` monitors text inputs using the custom hook `useVariableParser.js`. It runs a regular expression lookup:
```javascript
const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
```
1. Captures all expressions inside double braces (e.g. `{{user_name}}`).
2. Filters out empty brackets (like `{{}}`).
3. Deduplicates matches and calculates the offset height for target handles using:
   $$\text{topOffset} = \frac{(idx + 1) \times 100}{\text{variables.length} + 1}\%$$
4. Recalculates coordinates inside React Flow's DOM cache using `useUpdateNodeInternals(id)` to prevent handle alignment drift.

---

## Backend Graph & DAG Validation Engine

The FastAPI endpoint receives the parsed graph structure and executes validation tests inside [parse.py](file:///Users/aryakharwadkar/Downloads/VectorShift/backend/pipelines/parse.py):

### 1. Adjacency Table Build
Maps all directed edges:
$$\text{Adjacency List}: v \rightarrow [u_1, u_2, \dots]$$
Self-loop checks reject connections where $\text{source} == \text{target}$ at the API router layer.

### 2. DFS Cycle Checking Algorithm
Uses recursive depth-first search with double tracking sets:
* **`visited`**: Nodes completely traversed and verified acyclic.
* **`rec_stack`**: Current recursion path stack.
If a traversal encounters a node already present in the active `rec_stack`, a **back-edge** exists, proving a cycle:

```python
def dfs(node_id):
    if node_id in rec_stack:
        return True # Loop Detected
    if node_id in visited:
        return False
        
    visited.add(node_id)
    rec_stack.add(node_id)
    
    for neighbor in adjacency.get(node_id, []):
        if dfs(neighbor):
            return True
            
    rec_stack.remove(node_id)
    return False
```

---

## Installation & Local Deployment

### 1. Backend Service (FastAPI)
Launch the validation service on port `8000`:
```bash
cd backend

# Create a virtual environment (optional)
python3 -m venv venv
source venv/bin/activate

# Install required packages
pip install fastapi uvicorn

# Start the uvicorn development server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Interface (React)
Launch the web interface on port `3000`:
```bash
cd frontend

# Install package modules
npm install

# Start the development client
npm start
```
Go to `http://localhost:3000` to view the running app.

---

## API Endpoints Reference

### Parse Pipeline Graph
* **Route**: `/pipelines/parse`
* **Method**: `POST`
* **Content-Type**: `application/json`

#### Request Schema
```json
{
  "nodes": [
    { "id": "input-1", "type": "input", "position": { "x": 100, "y": 200 }, "data": {} }
  ],
  "edges": [
    { "id": "edge-input-1-value-output-1-value", "source": "input-1", "target": "output-1" }
  ]
}
```

#### Successful Response (DAG)
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

#### Bad Request / Cycle Detected (HTTP 400 or HTTP 200 depending on Graph State)
* Self-loop requests return `400 Bad Request` with message detail.
* Cycle paths return `is_dag: false` in JSON format, triggering connection lines to highlight in red.
