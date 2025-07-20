import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { setContractEditor } from "../services/redux/reducer/addcontracteditor";
import debounce from "lodash.debounce"; // Import lodash debounce

const modules = {
  toolbar: [
    [{ header: ["Heading", 1, 2, 3, 4, 5, 6] }],
    [{ size: ["normal", "small", "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ list: "bullet" }],
    [{ list: "ordered" }, { indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "height",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "color",
  "bullet",
  "indent",
  "link",
  "image",
  "align",
  "size",
];

export default function TestingEditor({ imgcontent }) {
  const dispatch = useDispatch();
  const quillRef = useRef(null);
  const [valuecontent, setvaluecontent] = useState("");

  useEffect(() => {
    if (imgcontent !== null) {
      setvaluecontent(imgcontent);
      dispatch(setContractEditor(imgcontent));
    }
  }, [imgcontent]);

  // Debounced function to update state
  const debouncedUpdate = useCallback(
    debounce((content) => {
      dispatch(setContractEditor(content));
    }, 300), // Adjust delay as needed
    []
  );

  const handleProcedureContentChange = (content) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const selection = editor.getSelection(); // Preserve cursor position

      setvaluecontent(content);
      debouncedUpdate(content); // Use debounce to reduce re-renders

      // Restore cursor position
      if (selection) {
        setTimeout(() => {
          editor.setSelection(selection);
        }, 0);
      }
    }
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={valuecontent}
      onChange={handleProcedureContentChange}
      modules={modules}
      formats={formats}
      placeholder="Type here...."
      style={{ height: "100%", width: "940px" }}
    />
  );
}
