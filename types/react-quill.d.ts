declare module 'react-quill' {
    import React from 'react';

    export interface ReactQuillProps {
        theme?: string;
        modules?: any;
        formats?: string[];
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        readOnly?: boolean;
        onChange?: (content: string, delta: any, source: string, editor: any) => void;
        onChangeSelection?: (range: any, source: string, editor: any) => void;
        className?: string;
        style?: React.CSSProperties;
        bounds?: string | HTMLElement;
        scrollingContainer?: string | HTMLElement;
        preserveWhitespace?: boolean;
        children?: React.ReactNode;
    }

    const ReactQuill: React.ComponentType<ReactQuillProps>;
    export default ReactQuill;
}