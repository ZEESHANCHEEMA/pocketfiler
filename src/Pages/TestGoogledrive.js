import React, { useState, useEffect } from 'react';

const CLIENT_ID ='402370681283-uosgpmu7kb0th4ccml6175oqr2m379mi.apps.googleusercontent.com'; // Replace with your own client ID
const API_KEY = 'AIzaSyC0vO36WSDCxOHWsMzJSXZgY9K6Aaq3hlI'; // Replace with your own API key
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

const TestGoogledrive = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      setGapiLoaded(true);
    };
    script.onerror = () => {
      console.error('Error loading Google API client library.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (gapiLoaded && window.gapi) {
      window.gapi.load('client:auth2', initializeGoogleDriveAPI);
    }
  }, [gapiLoaded]);

  const initializeGoogleDriveAPI = () => {
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      console.log('Google Drive API initialized.');
    }, (error) => {
      console.error('Error initializing Google Drive API:', error);
    });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!window.gapi) {
      console.error('Google API client library is not loaded.');
      return;
    }
    window.gapi.auth2.getAuthInstance().signIn().then(() => {
      const metadata = {
        name: selectedFile.name,
        mimeType: selectedFile.type
      };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', selectedFile);

      window.gapi.client.drive.files.create({
        resource: metadata,
        media: {
          mimeType: selectedFile.type,
          body: form
        },
        fields: 'id'
      }).then((response) => {
        console.log('File ID:', response.result.id);
        // File uploaded successfully, you can handle further actions here
      }, (error) => {
        console.error('Error uploading file:', error);
      });
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || !gapiLoaded}>Upload</button>
    </div>
  );
};

export default TestGoogledrive;
