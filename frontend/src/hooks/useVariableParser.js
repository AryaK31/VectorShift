import { useMemo } from 'react';

/**
 * useVariableParser Custom Hook
 * Parses a string template to find all variables formatted inside double curly braces (e.g., {{variableName}}).
 * Returns a deduplicated array of unique variable names.
 * 
 * @param {string} text - The input template text.
 * @returns {string[]} An array of unique variable name strings.
 */
export const useVariableParser = (text) => {
  return useMemo(() => {
    if (!text || typeof text !== 'string') {
      return [];
    }

    // Matches {{variableName}} with optional leading/trailing spaces.
    // Captured group [a-zA-Z0-9_]+ ensures empty expressions like {{}} are ignored.
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    const variables = [];
    let match;

    // Reset regex index and find matches
    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      variables.push(match[1]);
    }

    // Deduplicate array values
    return Array.from(new Set(variables));
  }, [text]);
};

export default useVariableParser;
