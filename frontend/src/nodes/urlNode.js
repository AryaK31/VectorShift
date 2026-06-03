import React from 'react';
import { BaseNode } from '../components/nodes/BaseNode';
import { nodeConfigs } from '../utils/constants';

export const URLNode = ({ id, data, onDataChange }) => {
  return (
    <BaseNode
      id={id}
      type="url"
      config={nodeConfigs.url}
      data={data}
      onDataChange={onDataChange}
    />
  );
};
