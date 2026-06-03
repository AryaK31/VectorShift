import React from 'react';
import { BaseNode } from '../components/nodes/BaseNode';
import { nodeConfigs } from '../utils/constants';

export const InputNode = ({ id, data, onDataChange }) => {
  return (
    <BaseNode
      id={id}
      type="input"
      config={nodeConfigs.input}
      data={data}
      onDataChange={onDataChange}
    />
  );
};
