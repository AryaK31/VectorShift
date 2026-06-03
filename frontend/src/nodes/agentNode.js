import React from 'react';
import { BaseNode } from '../components/nodes/BaseNode';
import { nodeConfigs } from '../utils/constants';

export const AgentNode = ({ id, data, onDataChange }) => {
  return (
    <BaseNode
      id={id}
      type="agent"
      config={nodeConfigs.agent}
      data={data}
      onDataChange={onDataChange}
    />
  );
};
