import React, { useState, useRef, useCallback, createContext } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { usePipelineState } from '../../hooks/usePipelineState';
import { PipelineToolbar } from '../../toolbar';
import { SubmitButton } from '../SubmitButton/SubmitButton';

import { InputNode } from '../../nodes/inputNode';
import { LLMNode } from '../../nodes/llmNode';
import { OutputNode } from '../../nodes/outputNode';
import { TextNode } from '../nodes/TextNode';
import { PromptNode } from '../../nodes/promptNode';
import { URLNode } from '../../nodes/urlNode';
import { DatabaseNode } from '../../nodes/databaseNode';
import { FileNode } from '../../nodes/fileNode';
import { AgentNode } from '../../nodes/agentNode';

import 'reactflow/dist/style.css';
import './Canvas.css';

// Node Type Registry
const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  llm: LLMNode,
  text: TextNode,
  prompt: PromptNode,
  url: URLNode,
  database: DatabaseNode,
  file: FileNode,
  agent: AgentNode,
};

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Central context to share local state actions with custom nodes
export const CanvasContext = createContext(null);

export const Canvas = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Initialize pipeline state hook
  const state = usePipelineState();
  const {
    nodes,
    edges,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = state;

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        // Verify node type
        if (!type) return;

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Add node via local state hook
        addNode(type, position);
      }
    },
    [reactFlowInstance, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <CanvasContext.Provider value={state}>
      <div className="canvas-wrapper">
        <PipelineToolbar />
        <div ref={reactFlowWrapper} className="reactflow-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            proOptions={proOptions}
            snapGrid={[gridSize, gridSize]}
            connectionLineType="smoothstep"
          >
            <Background color="#aaa" gap={gridSize} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        <SubmitButton />
      </div>
    </CanvasContext.Provider>
  );
};

export default Canvas;
