import React, { useState } from "react";

import DropboxChooser from "react-dropbox-chooser";

// const APP_KEY = "aap7woidfm3fzfp";
const APP_KEY = "pbd8yygg97ghlb4";

function  DropboxFileUpload() {
  const [fileNames, setFileNames] = useState([]);

  const onSuccess = (files) => {
    console.log("DROPBOX UPLOADED FILE:", files);
    files.map((file) => {
      setFileNames((fileNames) => [...fileNames, file]);
    });
  };

  return (
    <div className="container">
      <DropboxChooser
        appKey={APP_KEY}
        success={(files) => onSuccess(files)}
        cancel={() => console.log("closed")}
        multiselect={true}
      >
        <br />
        <button className="uploadBtn">Choose files from Dropbox</button>
        <div className="dropbox"> </div>
      </DropboxChooser>

      <br />
      <br />

      <ul>
        {fileNames.map((fileName, index) => (
          <div>
            <li key={index}>File name:{fileName.name}</li>
            <li key={index}>Size: {fileName.bytes} bytes</li>
            <li key={index}>
              Link: <a href={fileName.link}>Download File</a>
            </li>
            <hr />
          </div>
        ))}
      </ul>
    </div>
  );
}

export default DropboxFileUpload;
