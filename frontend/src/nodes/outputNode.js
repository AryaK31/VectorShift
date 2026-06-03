import React from 'react';
import { BaseNode } from '../components/nodes/BaseNode';
import { nodeConfigs } from '../utils/constants';

export const OutputNode = ({ id, data, onDataChange }) => {
  return (
    <BaseNode
      id={id}
      type="output"
      config={nodeConfigs.output}
      data={data}
      onDataChange={onDataChange}
    />
  );
};
