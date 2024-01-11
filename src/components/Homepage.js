// Homepage.js

import React, { useState } from "react";
import "./Homepage.css"; // Import the CSS file for homepage styles
import BackgroundScene from "./BackgroundScene";

const Homepage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sliderValue, setSliderValue] = useState(1);
  const [processing, setProcessing] = useState(false);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    if (image) {
      setUploadedImage(URL.createObjectURL(image));
      setUploadedFile(image);
      setPreviewVisible(true); // Show the image preview section
    }
  };

  const handleConfirmClick = async () => {
    const imageData = new FormData();
    setProcessing(true);
    imageData.append("file", uploadedFile);
    imageData.append("scale", valueDisplay());

    for (const entry of imageData.entries()) {
      console.log(entry);
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        // Change the endpoint to /upload
        method: "POST",
        body: imageData,
      });

      if (response.ok) {
        console.log("Success");
        // Receive processed image data from the backend
        const processedImageData = await response.blob(); // Adjust based on response type

        // Create a downloadable URL for the processed image
        const downloadUrl = URL.createObjectURL(processedImageData);

        // Trigger a download for the processed image
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "processed_image.jpg"; // Change the filename and extension accordingly
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Handle error response from the backend
        console.error("Failed to receive processed image");
      }
    } catch (error) {
      // Handle error connecting to the backend
      console.error("Failed to connect to the backend");
    } finally {
      setProcessing(false);
      setUploadedImage(null);
      setPreviewVisible(false);
      setSliderValue(1);
    }
  };
  const valueDisplay = () => {
    if (sliderValue === "0.5") return "1/3";
    if (sliderValue === "0.75") return "1/2";
    if (sliderValue === "1") return "1";
    if (sliderValue === "1.25") return "2";
    if (sliderValue === "1.5") return "3";
  };

  return (
    <div className={`dark-theme ${previewVisible ? "preview-visible" : ""}`}>
      <BackgroundScene />
      <div className="content">
        <div
          className={`text-container ${uploadedImage ? "preview-visible" : ""}`}
        >
          <div className="resyze-text">Re</div>
          <div className="syze-text">Syze</div>
        </div>
        <label htmlFor="fileInput" className="custom-file-upload">
          Upload File
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </label>
      </div>
      <div className={`preview-section${previewVisible ? " visible" : ""}`}>
        <div className="preview-box">
          <img src={uploadedImage} alt="Preview" />
        </div>
      </div>
      {previewVisible && !processing && (
        <div className="slider" style={{ marginTop: "30px" }}>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.25"
            value={sliderValue}
            onChange={handleSliderChange}
            className="slider-input"
          />
          <div className="slider-value">{valueDisplay()}</div>
          <button onClick={handleConfirmClick} className="confirm-button">
            Confirm
          </button>
        </div>
      )}
      {processing && (
        <div className="loading-text">
          <p>Processing</p>
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
