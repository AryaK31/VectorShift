import { useState, useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge as rfAddEdge } from 'reactflow';

/**
 * usePipelineState Custom Hook
 * Manages the state of nodes and edges locally, ensuring it is 100% JSON-serializable.
 */
export const usePipelineState = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Generates a unique, auto-incrementing ID for a given node type
  const generateID = (type) => {
    const typedNodes = nodes.filter((n) => n.type === type);
    const maxId = typedNodes.reduce((max, node) => {
      const idNum = parseInt(node.id.replace(`${type}-`, ''), 10);
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);
    return `${type}-${maxId + 1}`;
  };

  const addNode = (type, position) => {
    const newId = generateID(type);
    const newNode = {
      id: newId,
      type,
      position,
      data: { id: newId, nodeType: type },
    };
    setNodes((prev) => [...prev, newNode]);
    return newId;
  };

  const updateNode = (id, data) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...data },
          };
        }
        return node;
      })
    );
  };

  const removeNode = (id) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setEdges((prev) => prev.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const addEdge = (source, target, sourceHandle, targetHandle) => {
    const newEdge = {
      id: `edge-${source}-${sourceHandle}-${target}-${targetHandle}`,
      source,
      target,
      sourceHandle,
      targetHandle,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: 'arrowclosed' },
    };
    setEdges((prev) => [...prev, newEdge]);
  };

  const removeEdge = (sourceId, targetId) => {
    setEdges((prev) =>
      prev.filter((edge) => !(edge.source === sourceId && edge.target === targetId))
    );
  };

  const getNodes = () => nodes;
  const getEdges = () => edges;

  // React Flow integration handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        rfAddEdge(
          {
            ...connection,
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: 'arrowclosed' },
          },
          eds
        )
      ),
    []
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    getNodes,
    getEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  };
};

export default usePipelineState;
