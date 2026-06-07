import React, { useContext } from 'react';
import { Handle, Position } from 'reactflow';
import { CanvasContext } from '../Canvas/Canvas';
import { nodeConfigs } from '../../utils/constants';
import './BaseNode.css';



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
 * @param {React.ReactNode} [props.children] - Nested custom component elements.
 */
export const BaseNode = ({
  id,
  type,
  config: propConfig,
  data,
  onDataChange,
  children,
}) => {
  // Resolve type and configuration
  const nodeType = type || data?.nodeType;
  const config = propConfig || nodeConfigs[nodeType];

  // Retrieve canvas state context
  const context = useContext(CanvasContext);
  const updateNode = context?.updateNode;
  const removeNode = context?.removeNode;

  if (!config) {
    return (
      <div className="node-container" style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2' }}>
        <strong>Unknown Node:</strong> {nodeType}
      </div>
    );
  }

  const handleFieldChange = (fieldName, value) => {
    if (updateNode) {
      updateNode(id, { [fieldName]: value });
    }
    if (onDataChange) {
      onDataChange(fieldName, value);
    }
  };

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
        <span>{config.label}</span>
        {removeNode && (
          <button
            onClick={() => removeNode(id)}
            className="node-delete-btn"
            title="Delete Node"
          >
            &times;
          </button>
        )}
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

      {/* Custom children injected from wrapper components */}
      {children}
    </div>
  );
};
export default BaseNode;
