/**
 * submitPipeline API Utility
 * Issues a POST request to parse the pipeline layout (nodes and edges) on the backend.
 * 
 * @param {Object[]} nodes - Serializable React Flow node objects.
 * @param {Object[]} edges - Serializable React Flow edge objects.
 * @returns {Promise<Object>} The parsed pipeline properties response.
 */
export const submitPipeline = async (nodes, edges) => {
  const response = await fetch('http://localhost:8000/pipelines/parse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nodes, edges }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || `Server responded with status code ${response.status}`);
  }

  return await response.json();
};

export default submitPipeline;
