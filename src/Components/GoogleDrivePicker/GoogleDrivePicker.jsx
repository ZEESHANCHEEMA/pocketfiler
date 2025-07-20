import  { useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker'
function GoogleDrivePicker() {
    const [openPicker, authResponse] = useDrivePicker();  
    // const customViewsArray = [new google.picker.DocsView()]; // custom view
    const handleOpenPicker = () => {
      openPicker({
        clientId: "704961265565-7qkgk1c1gcfp5lvnls4kf4acllgn1aj9.apps.googleusercontent.com",
        developerKey: "AIzaSyB4nnxhVHH3x56jRCDnDThfnvXMYKHhmYQ",
        viewId: "DOCS",
        // token: token, // pass oauth token in case you already have one
        showUploadView: true,
        showUploadFolders: true,
        supportDrives: true,
        multiselect: true,
        // customViews: customViewsArray, // custom view
        callbackFunction: (data) => {
          if (data.action === 'cancel') {
            console.log('User clicked cancel/close button')
          }
          console.log(data)
        },
      })
    }
  
  
    
    return (
      <div>
          <button onClick={() => handleOpenPicker()}>Open Picker</button>
      </div>
    );
  }
  
  export default GoogleDrivePicker;