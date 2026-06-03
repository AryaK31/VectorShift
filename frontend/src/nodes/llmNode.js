import React from 'react';
import { BaseNode } from '../components/nodes/BaseNode';
import { nodeConfigs } from '../utils/constants';

export const LLMNode = ({ id, data, onDataChange }) => {
  return (
    <BaseNode
      id={id}
      type="llm"
      config={nodeConfigs.llm}
      data={data}
      onDataChange={onDataChange}
    />
  );
};
