import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Container, Grid, Input } from "@mui/material";

function ImageClassifier() {
  const [file, setFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const [result, setResult] = useState("");
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);

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
      console.log(response.data.result)
      if (response.data.result === "flesh_apple") {
        setX((prevX) => [...prevX, previewSource]);
      } else {
        setY((prevY) => [...prevY, previewSource]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <Box>
      <Container>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3} alignItems="center" textAlign="center">
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
            {result === "fresh_apple" ? <p>新鮮なリンゴ</p>: <p>腐ったリンゴ</p>}
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
      </Container>

      <Container>
      {x.map((img) => (
        <img src={img} alt="Preview" style={{weight: 200, height: 200}}/>
      ))}
      </Container>

      <Container>
      {y.map((img) => (
        <img src={img} alt="Preview" style={{weight: 200, height: 200}}/>
      ))}
      </Container>
    </Box>
  );
}

export default ImageClassifier;
