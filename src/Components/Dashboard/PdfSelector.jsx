import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const PdfSelector = ({ onFileUpload }) => {
  const onDrop = (acceptedFiles) => {
    onFileUpload(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (

    // Select Pdf File from PC Using react-dropzone Package
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      <p>Drag & drop a PDF file here, or click to select one</p>
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
};

export default PdfSelector