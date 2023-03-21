import React, { useState } from "react";
import axios from "axios";

function ImageClassifier() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    axios.post('http://127.0.0.1:3001/classify', formData, {
      headers: {
        'content-type': 'multipart/form-data'
     }
    })
    .then((response) => {
      setResult(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileUpload} />
        <button type="submit">Classify Image</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}

export default ImageClassifier;
