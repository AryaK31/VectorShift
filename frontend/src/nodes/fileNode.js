import React from 'react';
import { BaseNode } from '../components/nodes/BaseNode';
import { nodeConfigs } from '../utils/constants';

export const FileNode = ({ id, data, onDataChange }) => {
  return (
    <BaseNode
      id={id}
      type="file"
      config={nodeConfigs.file}
      data={data}
      onDataChange={onDataChange}
    />
  );
};
