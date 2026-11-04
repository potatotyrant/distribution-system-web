"use client";

import "react-quill-new/dist/quill.snow.css";

import React, { useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";

import styled from "styled-components";

const EditorWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .ql-container {
    min-height: 360px;
    border: none !important;
  }

  .ql-toolbar {
    border: none !important;
    border-top: 1px solid #eaeaea !important;
    border-bottom: 1px solid #eaeaea !important;
  }

  .ql-editor {
    font-size: 18px;
    flex: 1;
    min-height: 350px;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: attr(data-value) !important;
  }
`;

// Size 속성에 타입 지정
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Size = Quill.import("attributors/style/size") as any;
Size.whitelist = Array.from({ length: 40 }, (_, i) => `${i + 1}px`);
Quill.register(Size, true);

const modules = {
  toolbar: [
    [
      {
        size: [
          "12px",
          "14px",
          "16px",
          "18px",
          "20px",
          "24px",
          "30px",
          "36px",
          "40px",
        ],
      },
    ],
    ["bold", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
  ],
};

// readOnly일 때 사용할 모듈 설정 추가
const readOnlyModules = {
  toolbar: false,
};

const formats = [
  "size",
  "bold",
  "underline",
  "strike",
  "blockquote",
  "list",
  "align",
];

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const Editor = ({ value, onChange, readOnly }: EditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current && !readOnly) {
      const editor = quillRef.current.getEditor();
      editor.format("size", "18px");
    }
  }, []);

  return (
    <EditorWrapper>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={readOnly ? readOnlyModules : modules}
        formats={formats}
        readOnly={readOnly}
      />
    </EditorWrapper>
  );
};

export default Editor;
