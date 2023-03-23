import React, { useState } from "react";
import axios from "axios";
import { Button, Grid, Input } from "@mui/material";

function ImageClassifier() {
  const [file, setFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const [result, setResult] = useState("");

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    previewFile(uploadedFile);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
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
    <>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Input
              type="file"
              variant="contained"
              color="primary"
              placeholder="select"
              onChange={handleFileUpload}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          {previewSource && (
            <img
              src={previewSource}
              alt="Preview"
              style={{ maxHeight: '200px' }}
            />
          )}
          {result == "stale_apple" ? <p>腐ったリンゴ</p>: <p>新鮮なリンゴ</p>}
        </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Upload
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default ImageClassifier;
