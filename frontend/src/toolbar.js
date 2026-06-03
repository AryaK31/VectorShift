// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='input' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='output' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='prompt' label='Prompt Template' />
                <DraggableNode type='url' label='URL Loader' />
                <DraggableNode type='database' label='Database' />
                <DraggableNode type='file' label='File Reader' />
                <DraggableNode type='agent' label='AI Agent' />
            </div>
        </div>
    );
};
