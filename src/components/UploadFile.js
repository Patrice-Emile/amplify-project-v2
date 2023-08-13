import React, { useState } from "react";
import { Amplify, Storage } from "aws-amplify";
import { Button } from "@aws-amplify/ui-react";
import awsExports from "../aws-exports";

Amplify.configure(awsExports);
const UploadFile = ({ styles }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    try {
      const fileName = file.name;
      const result = await Storage.put(fileName, file, {
        level: "private",
        contentType: "Image",
      });
      console.log("File uploaded successfully:", result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <input style={styles.input} type="file" onChange={handleFileChange} />
      <Button style={styles.button} onClick={handleFileUpload}>
        Upload File
      </Button>
    </div>
  );
};

export default UploadFile;
