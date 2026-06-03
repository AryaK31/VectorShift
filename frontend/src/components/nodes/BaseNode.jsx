import React from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../../store';
import { nodeConfigs } from '../../utils/constants';
import './BaseNode.css';

// SVG or Emoji icons mapped by nodeType
const nodeIcons = {
  input: '📥',
  output: '📤',
  llm: '🧠',
  text: '📝',
  prompt: '💡',
  url: '🔗',
  database: '🗄️',
  file: '📁',
  agent: '🤖',
};

/**
 * BaseNode Component
 * Central abstraction representing a node on the canvas.
 * 
 * @param {Object} props
 * @param {string} props.id - Node identifier.
 * @param {string} [props.type] - Node type (e.g. 'input', 'llm'). Defaults to data.nodeType.
 * @param {Object} [props.config] - Optional config override.
 * @param {Object} props.data - Node data state.
 * @param {Function} [props.onDataChange] - Callback triggered when fields change.
 */
export const BaseNode = ({
  id,
  type,
  config: propConfig,
  data,
  onDataChange,
}) => {
  // Resolve type and configuration
  const nodeType = type || data?.nodeType;
  const config = propConfig || nodeConfigs[nodeType];

  // Sync to store
  const updateNodeField = useStore((state) => state.updateNodeField);

  if (!config) {
    return (
      <div className="node-container" style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2' }}>
        <strong>Unknown Node:</strong> {nodeType}
      </div>
    );
  }

  const handleFieldChange = (fieldName, value) => {
    if (updateNodeField) {
      updateNodeField(id, fieldName, value);
    }
    if (onDataChange) {
      onDataChange(fieldName, value);
    }
  };

  const icon = nodeIcons[nodeType] || '⚙️';

  return (
    <div className={`node-container node-${nodeType}`}>
      {/* Target/Source Handles */}
      {config.handles &&
        config.handles.map((handle, index) => {
          const handlePosition =
            handle.position === 'left' ? Position.Left : Position.Right;
          return (
            <Handle
              key={`${id}-handle-${index}`}
              type={handle.type}
              position={handlePosition}
              id={`${id}-${handle.id}`}
              style={handle.style}
            />
          );
        })}

      {/* Node Header */}
      <div className="node-header">
        <span className="node-icon">{icon}</span>
        <span>{config.label}</span>
      </div>

      {/* Node Description */}
      {config.description && (
        <div className="node-description">
          <span>{config.description}</span>
        </div>
      )}

      {/* Dynamic Fields */}
      {config.fields && config.fields.length > 0 && (
        <div className="node-fields">
          {config.fields.map((field) => {
            // Resolve field value
            const value =
              data?.[field.name] !== undefined
                ? data[field.name]
                : field.getDefaultValue
                ? field.getDefaultValue(id)
                : field.defaultValue !== undefined
                ? field.defaultValue
                : '';

            return (
              <div key={field.name}>
                <label className="node-field-label">
                  {field.label}
                  {field.type === 'select' ? (
                    <select
                      className="node-select-field"
                      value={value}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className="node-textarea-field"
                      value={value}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    />
                  ) : (
                    <input
                      className="node-input-field"
                      type="text"
                      value={value}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    />
                  )}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default BaseNode;
