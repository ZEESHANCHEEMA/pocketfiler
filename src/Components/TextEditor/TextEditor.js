import React, { useState, useEffect } from "react";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "./TextEditor.css";
import { useDispatch, useSelector } from "react-redux";
import { setContractEditor } from "../../services/redux/reducer/addcontracteditor";
var modules = {
  toolbar: [
    [{ header: ["Heading", 1, 2, 3, 4, 5, 6] }],
    [{ size: ["normal", "small", "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
      { align: [] },
    ],
    ["clean"],
    [{}],
  ],
};

var formats = [
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

export default function TextEditor({ imgcontent }) {
  const dispatch = useDispatch();
  const [valuecontent, setvaluecontent] = useState();

  const handleProcedureContentChange = (content) => {
    console.log("Editor Content Entered---->", imgcontent);

    if (imgcontent !== null) {
      setvaluecontent(content);
      dispatch(setContractEditor(content));
    } else {
      setvaluecontent(content);
      dispatch(setContractEditor(content));
    }
  };
  useEffect(() => {
    if (imgcontent !== null) {
      setvaluecontent(imgcontent);
    }
  }, [imgcontent]);

  const EditorContent = useSelector((state) => state?.addcontracteditor);
  console.log("Editor Content is", valuecontent);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          placeholder="Type here...."
          onChange={handleProcedureContentChange}
          style={{ height: "100%", width: "940px" }}
          value={valuecontent}
        ></ReactQuill>
      </div>
    </div>
  );
}
