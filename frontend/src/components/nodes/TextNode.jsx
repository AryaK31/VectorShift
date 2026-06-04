import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useVariableParser } from '../../hooks/useVariableParser';
import { nodeConfigs } from '../../utils/constants';

/**
 * TextNode Component
 * Represents a text template node on the canvas.
 * Parses variables inside double curly braces (e.g. {{variableName}}) and renders
 * corresponding target (input) handles dynamically along the left edge.
 */
export const TextNode = ({ id, data, onDataChange }) => {
  // Bind directly to global data.text, defaulting to '{{input}}'
  const [text, setText] = useState(data?.text ?? '{{input}}');
  
  // Extract unique variables
  const variables = useVariableParser(text);
  
  const textareaRef = useRef(null);

  // Sync default value to store if not present on mount
  useEffect(() => {
    if (data && data.text === undefined) {
      if (onDataChange) {
        onDataChange('text', '{{input}}');
      }
    }
  }, [data, onDataChange]);

  // Sync state with parent store
  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (onDataChange) {
      onDataChange('text', val);
    }
  };

  // Auto-grow textarea logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  return (
    <BaseNode id={id} type="text" config={nodeConfigs.text} data={data} onDataChange={onDataChange}>
      {/* Dynamic target handles rendered on the left for each parsed variable */}
      {variables.map((varName, idx) => {
        // Distribute handles vertically along the left edge
        const topOffset = `${((idx + 1) * 100) / (variables.length + 1)}%`;
        
        return (
          <Handle
            key={`${id}-var-${varName}`}
            type="target" // target handle acts as the input receiving connection
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{ top: topOffset }}
          />
        );
      })}

      {/* Sleek Auto-growing Textarea */}
      <div style={{ marginTop: '4px' }}>
        <label className="node-field-label">
          Text:
          <textarea
            ref={textareaRef}
            className="node-textarea-field"
            value={text}
            onChange={handleTextChange}
            placeholder="Type text with {{variable}}"
            style={{
              minHeight: '40px',
              fontFamily: 'monospace',
              fontSize: '11px',
              lineHeight: '1.4',
            }}
          />
        </label>
      </div>
    </BaseNode>
  );
};

export default TextNode;
