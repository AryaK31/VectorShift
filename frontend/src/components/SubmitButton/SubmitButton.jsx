import React, { useContext, useState } from 'react';
import { CanvasContext } from '../Canvas/Canvas';
import { submitPipeline } from '../../utils/api';
import './SubmitButton.css';

/**
 * SubmitButton Component
 * Fetches graph states, submits pipeline configurations, handles spinners,
 * and launches a custom styled validation modal.
 */
export const SubmitButton = () => {
  const context = useContext(CanvasContext);
  const nodes = context?.nodes || [];
  const edges = context?.edges || [];
  const setEdges = context?.setEdges;

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalError, setModalError] = useState(null);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      alert('Your pipeline is empty! Please drag and drop some nodes onto the canvas first.');
      return;
    }

    setLoading(true);
    setModalError(null);
    setModalData(null);

    // Clean node and edge elements to ensure they are 100% serializable
    const cleanNodes = nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));

    const cleanEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    }));

    try {
      const result = await submitPipeline(cleanNodes, cleanEdges);
      setModalData(result);
      setModalOpen(true);

      if (result.is_dag) {
        // Restore standard edge styling if graph is a valid DAG
        if (setEdges) {
          setEdges((prev) =>
            prev.map((edge) => ({
              ...edge,
              style: { ...edge.style, stroke: undefined, strokeWidth: undefined },
              animated: true,
            }))
          );
        }
      } else {
        // Highlight edges in red if a cycle is found
        if (setEdges) {
          setEdges((prev) =>
            prev.map((edge) => ({
              ...edge,
              style: { ...edge.style, stroke: '#ef4444', strokeWidth: 3 },
              animated: true,
            }))
          );
        }
      }
    } catch (err) {
      setModalError(err.message || 'An unknown network error occurred. Please check if the backend is running.');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Disable button if graph has no nodes or is loading
  const isButtonDisabled = nodes.length === 0 || loading;

  return (
    <div className="submit-container">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isButtonDisabled}
        className="submit-btn"
        title={nodes.length === 0 ? 'Add nodes to submit the pipeline' : 'Submit pipeline structure'}
      >
        {loading && <span className="submit-spinner" />}
        {loading ? 'Analyzing Graph...' : 'Submit Pipeline'}
      </button>

      {/* Styled React Modal Overlay */}
      {modalOpen && (
        <div className="submit-modal-overlay" onClick={handleCloseModal}>
          <div className="submit-modal-content" onClick={(e) => e.stopPropagation()}>
            {modalError ? (
              <>
                <span className="submit-modal-status-icon">⚠️</span>
                <h3 className="submit-modal-title">Submission Failed</h3>
                <p className="submit-modal-message">
                  {modalError.includes('Failed to fetch') 
                    ? 'Could not connect to backend. Make sure the FastAPI backend is running on http://localhost:8000.'
                    : modalError
                  }
                </p>
              </>
            ) : modalData ? (
              <>
                {modalData.is_dag ? (
                  <>
                    <span className="submit-modal-status-icon">✅</span>
                    <h3 className="submit-modal-title" style={{ color: '#10b981' }}>Pipeline Validated</h3>
                    <p className="submit-modal-message">
                      Your graph structure is correct and contains no feedback loops. It is a valid Directed Acyclic Graph (DAG).
                    </p>
                  </>
                ) : (
                  <>
                    <span className="submit-modal-status-icon">🚨</span>
                    <h3 className="submit-modal-title" style={{ color: '#ef4444' }}>Cycle Detected</h3>
                    <p className="submit-modal-message">
                      Feedback loops were found in your pipeline! All connected paths have been highlighted in red.
                    </p>
                  </>
                )}

                <div className="submit-modal-details">
                  <div className="submit-modal-detail-row">
                    <span className="submit-modal-detail-label">Total Nodes:</span>
                    <span className="submit-modal-detail-value">{modalData.num_nodes}</span>
                  </div>
                  <div className="submit-modal-detail-row">
                    <span className="submit-modal-detail-label">Total Connections:</span>
                    <span className="submit-modal-detail-value">{modalData.num_edges}</span>
                  </div>
                  <div className="submit-modal-detail-row">
                    <span className="submit-modal-detail-label">Is DAG Structure:</span>
                    <span 
                      className="submit-modal-detail-value" 
                      style={{ color: modalData.is_dag ? '#10b981' : '#ef4444' }}
                    >
                      {modalData.is_dag ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </>
            ) : null}

            <button 
              type="button" 
              onClick={handleCloseModal} 
              className="submit-modal-close-btn"
              style={{
                backgroundColor: modalError 
                  ? '#ef4444' 
                  : modalData?.is_dag 
                  ? '#10b981' 
                  : '#f97316'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitButton;
