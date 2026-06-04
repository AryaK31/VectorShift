/**
 * @typedef {Object} NodePosition
 * @property {number} x - The x-coordinate in the React Flow viewport.
 * @property {number} y - The y-coordinate in the React Flow viewport.
 */

/**
 * @typedef {Object} NodeData
 * @property {string} id - The unique ID of the node.
 * @property {string} nodeType - The type identifier of the node.
 * @property {string} [inputName] - Optional name parameter for Input node.
 * @property {string} [inputType] - Optional input data format (e.g., 'Text', 'File').
 * @property {string} [outputName] - Optional name parameter for Output node.
 * @property {string} [outputType] - Optional output format (e.g., 'Text', 'File').
 * @property {string} [text] - Optional template text for Text node.
 */

/**
 * @typedef {Object} ReactFlowNode
 * @description What each node in the nodes array looks like.
 * @property {string} id - Unique identifier for the node (e.g., 'input-1').
 * @property {string} type - React Flow node type matching keys in nodeTypes (e.g., 'input').
 * @property {NodePosition} position - Position of the node in the canvas layout.
 * @property {NodeData} data - Local parameter state associated with the node.
 */

/**
 * @typedef {Object} ReactFlowEdge
 * @description What each edge in the edges array looks like.
 * @property {string} id - Unique identifier for the edge (e.g., 'reactflow__edge-input-1-llm-2').
 * @property {string} source - The source node ID.
 * @property {string} target - The target node ID.
 * @property {string} sourceHandle - The ID of the specific source handle on the source node.
 * @property {string} targetHandle - The ID of the specific target handle on the target node.
 * @property {string} [type] - Edge type (e.g., 'smoothstep').
 * @property {boolean} [animated] - Whether the edge shows animation.
 */

export const nodeConfigs = {
  input: {
    type: 'input',
    label: 'Input',
    handles: [
      {
        type: 'source',
        position: 'right',
        id: 'value',
      }
    ],
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        getDefaultValue: (id) => id.replace('input-', 'input_'),
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
        ],
        defaultValue: 'Text',
      }
    ]
  },
  output: {
    type: 'output',
    label: 'Output',
    handles: [
      {
        type: 'target',
        position: 'left',
        id: 'value',
      }
    ],
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        getDefaultValue: (id) => id.replace('output-', 'output_'),
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'Image' },
        ],
        defaultValue: 'Text',
      }
    ]
  },
  llm: {
    type: 'llm',
    label: 'LLM',
    description: 'This is a LLM.',
    handles: [
      {
        type: 'target',
        position: 'left',
        id: 'system',
        style: { top: '33.3%' },
      },
      {
        type: 'target',
        position: 'left',
        id: 'prompt',
        style: { top: '66.6%' },
      },
      {
        type: 'source',
        position: 'right',
        id: 'response',
      }
    ],
    fields: []
  },
  text: {
    type: 'text',
    label: 'Text',
    handles: [
      {
        type: 'source',
        position: 'right',
        id: 'output',
      }
    ],
    fields: []
  },
  prompt: {
    type: 'prompt',
    label: 'Prompt Template',
    handles: [
      {
        type: 'target',
        position: 'left',
        id: 'template',
        style: { top: '33.3%' },
      },
      {
        type: 'target',
        position: 'left',
        id: 'variables',
        style: { top: '66.6%' },
      },
      {
        type: 'source',
        position: 'right',
        id: 'prompt',
      }
    ],
    fields: [
      {
        name: 'promptTemplate',
        label: 'Template String',
        type: 'text',
        defaultValue: 'Hello {{name}}, welcome to our service.',
      }
    ]
  },
  url: {
    type: 'url',
    label: 'URL Loader',
    handles: [
      {
        type: 'target',
        position: 'left',
        id: 'url',
      },
      {
        type: 'source',
        position: 'right',
        id: 'data',
      }
    ],
    fields: [
      {
        name: 'method',
        label: 'HTTP Method',
        type: 'select',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
        ],
        defaultValue: 'GET',
      }
    ]
  },
  database: {
    type: 'database',
    label: 'Database Connection',
    handles: [
      {
        type: 'source',
        position: 'right',
        id: 'queryResult',
      }
    ],
    fields: [
      {
        name: 'dbType',
        label: 'DB Engine',
        type: 'select',
        options: [
          { value: 'PostgreSQL', label: 'PostgreSQL' },
          { value: 'MySQL', label: 'MySQL' },
          { value: 'MongoDB', label: 'MongoDB' },
        ],
        defaultValue: 'PostgreSQL',
      },
      {
        name: 'query',
        label: 'SQL Query',
        type: 'text',
        defaultValue: 'SELECT * FROM users LIMIT 10;',
      }
    ]
  },
  file: {
    type: 'file',
    label: 'File Reader',
    handles: [
      {
        type: 'source',
        position: 'right',
        id: 'fileContent',
      }
    ],
    fields: [
      {
        name: 'format',
        label: 'File Format',
        type: 'select',
        options: [
          { value: 'PDF', label: 'PDF Document' },
          { value: 'CSV', label: 'CSV Spreadsheet' },
          { value: 'TXT', label: 'Plain Text' },
        ],
        defaultValue: 'PDF',
      }
    ]
  },
  agent: {
    type: 'agent',
    label: 'AI Agent',
    handles: [
      {
        type: 'target',
        position: 'left',
        id: 'instruction',
        style: { top: '33.3%' },
      },
      {
        type: 'target',
        position: 'left',
        id: 'memory',
        style: { top: '66.6%' },
      },
      {
        type: 'source',
        position: 'right',
        id: 'output',
      }
    ],
    fields: [
      {
        name: 'agentModel',
        label: 'Model Engine',
        type: 'select',
        options: [
          { value: 'GPT-4', label: 'GPT-4o' },
          { value: 'Gemini Pro', label: 'Gemini 1.5 Pro' },
          { value: 'Claude 3', label: 'Claude 3.5 Sonnet' },
        ],
        defaultValue: 'GPT-4',
      }
    ]
  }
};
