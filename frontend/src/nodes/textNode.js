import React from 'react';
import { BaseNode } from '../components/nodes/BaseNode';
import { nodeConfigs } from '../utils/constants';

export const TextNode = ({ id, data, onDataChange }) => {
  return (
    <BaseNode
      id={id}
      type="text"
      config={nodeConfigs.text}
      data={data}
      onDataChange={onDataChange}
    />
  );
};
