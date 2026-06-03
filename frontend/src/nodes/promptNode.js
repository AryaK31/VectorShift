import React from 'react';
import { BaseNode } from '../components/nodes/BaseNode';
import { nodeConfigs } from '../utils/constants';

export const PromptNode = ({ id, data, onDataChange }) => {
  return (
    <BaseNode
      id={id}
      type="prompt"
      config={nodeConfigs.prompt}
      data={data}
      onDataChange={onDataChange}
    />
  );
};
