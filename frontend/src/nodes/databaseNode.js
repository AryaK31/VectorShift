import React from 'react';
import { BaseNode } from '../components/nodes/BaseNode';
import { nodeConfigs } from '../utils/constants';

export const DatabaseNode = ({ id, data, onDataChange }) => {
  return (
    <BaseNode
      id={id}
      type="database"
      config={nodeConfigs.database}
      data={data}
      onDataChange={onDataChange}
    />
  );
};
