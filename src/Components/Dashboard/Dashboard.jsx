import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import "./Dashboard.css"
import axios from 'axios'
import { apiurl } from "../Apiconfig/Apiconfig"

function Dashboard() {

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [newPdf, setNewPdf] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageInput, setPageInput] = useState('');
  const [sortbtn, setSortbtn] = useState(false)
  const [error, setError] = useState(null)

  var token = localStorage.getItem("token")


  //Handle to Save Selected Pdf and total PageNumber on State
  const onFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.type !== 'application/pdf') {
      setError('Please upload PDF file Only.');
      return;
    }
    setSelectedPdf(URL.createObjectURL(file));
    getTotalPages(file);
    setError('');

  };


  //Function to Calculate PageNumber of Selected PDF
  const getTotalPages = async (file) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const pdfBytes = new Uint8Array(reader.result);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      setTotalPages(pdfDoc.getPageCount());
    };
    reader.readAsArrayBuffer(file);
  };


  //PageNumbers to Save as New PDF, Storing in State
  const handlePageInput = (event) => {
    setPageInput(event.target.value);
  };

  //Handle to Validate Pagenumbers to Create New PDF, Entered are in Correct Format and also prevent repeat of PageNumbers
  const handleAddPages = () => {
    const newPages = pageInput.split(',').map((page) => parseInt(page.trim()));

    const validNewPages = newPages.filter(
      (page) => !isNaN(page) && page > 0 && page <= totalPages && !selectedPages.includes(page)
    );
    setSelectedPages([...selectedPages, ...validNewPages]);
    setPageInput('');
  };


  //Handle to Remove Page Number From State(Creating New PDF)
  const handleDeletePage = (page) => {
    const updatedPages = selectedPages.filter((selectedPage) => selectedPage !== page);
    setSelectedPages(updatedPages);
  };

  //Handle to Move Selected Page Number One Place Up
  const handleMoveUp = (index) => {
    if (index > 0) {
      const reorderedPages = [...selectedPages];
      [reorderedPages[index - 1], reorderedPages[index]] = [
        reorderedPages[index],
        reorderedPages[index - 1],
      ];
      setSelectedPages(reorderedPages);
    }
  };


  //Handle to Move Selected Page Number One Place Down
  const handleMoveDown = (index) => {
    if (index < selectedPages.length - 1) {
      const reorderedPages = [...selectedPages];
      [reorderedPages[index], reorderedPages[index + 1]] = [
        reorderedPages[index + 1],
        reorderedPages[index],
      ];
      setSelectedPages(reorderedPages);
    }
  };


  //Handle to Create New PDF from Selected PDF and Page Numbers then save to New State
  const handleCreatePDF = async () => {
    try {
      const pdfBytes = await createNewPDF(selectedPdf, selectedPages);
      const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
      setNewPdf(url);
    } catch (error) {
      console.error('Error creating new PDF:', error);
    }
  };

  //Function to Generate New PDF
  const createNewPDF = async (pdfURL, pages) => {
    const pdfBytes = await fetch(pdfURL).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();

    for (const pageNumber of pages) {
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNumber - 1]);
      newPdf.addPage(copiedPage);
    }

    return newPdf.save();
  };


  //Handle to Save PDF TO Backend DB
  const handleSaveToBackend = async () => {
    try {

      //Get Signed URL For Uploading File to AWS S3 
      await axios.get(`${apiurl}/api/v1/home/pdf/upload/pdffile.pdf?mime=application/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {

        //Upload PDF to S3 using the Signed Url
        if (res) {
          console.log(res.data.uploadUrl)
          // Get the PDF as Blob
          const pdfBlob = await createNewPDF(selectedPdf, selectedPages);

          // API to upload the PDF to the signed URL
          await axios.put(res.data.uploadUrl, pdfBlob, {
            headers: {
              'Content-Type': 'application/pdf',
            },
          }).then((data) => {
            //After File Saved TO S3 send the filePath to Backend , Saving the Data to DB with UserId
            data = { pdfuri: res.data.pathName }
            axios.post(`${apiurl}/api/v1/home/createpdf`, data, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            })
            alert("Sucess")

          }).catch((err) => [
            alert(err.message)
          ]);


        } else {
          alert("error")
        }
      });


    } catch (error) {
      console.error('Error saving PDF to backend:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFileUpload,
    accept: 'application/pdf',
  });

  return (
    <div className='dashboarddata'>

      <div className='d-flex justify-content-center pt-5'>

        <div {...getRootProps()} style={dropzoneStyle}>
          <input {...getInputProps()} />
          <p>Drag & drop a PDF file here, or click to select one</p>
        </div>

      </div>
      {error ? <div className='text-danger text-center mt-4'>{error}</div> : <div></div>}
      <div className='d-flex justify-content-around mt-5'>
        <div>
          {selectedPdf && (
            <div>
              <b><h3>Selected PDF:</h3></b>
              <embed src={selectedPdf} width="500" height="600" type="application/pdf" />

              <b><p className='mt-3'>Add Page Numbers (Ex- 1,2,3):</p></b>
              <div className='row'>
                <div className='col-auto pe-0'><input
                  className='form-control '
                  type="text"
                  value={pageInput}
                  onChange={handlePageInput}
                  placeholder={`Enter page numbers (1-${totalPages})`}
                /></div>
                <div className='col-auto ps-0'>
                  <button className='btn btn-primary ' onClick={handleAddPages}>Add Pages</button>
                </div>
              </div>

              <div>
                <div className='d-flex mt-4'>
                  <div>
                    <b><p className='mt-2'>Sort Pages:</p></b>
                  </div>
                  <div>
                    {sortbtn ? <button onClick={() => { setSortbtn(!sortbtn) }} className='btn btn-danger mx-4'>Show</button> :
                      <button onClick={() => { setSortbtn(!sortbtn) }} className='btn btn-danger mx-4'>Hide</button>

                    }
                  </div>
                </div>

                {!sortbtn ? <ol>
                  {selectedPages.map((page, index) => (
                    <li key={index}>
                      <div className='d-flex pt-2'>
                        <div className='mx-2'>Page {page}</div>
                        <div className='mx-2'> <button className='btn btn-danger' onClick={() => handleDeletePage(page)}>Delete</button></div>
                        <div className='mx-2'>
                          <button className='btn btn-secondary' onClick={() => handleMoveUp(index)} disabled={index === 0}>
                            Move Up
                          </button>
                        </div>
                        <div className='mx-2'>

                          <button className='btn btn-secondary' onClick={() => handleMoveDown(index)} disabled={index === selectedPages.length - 1}>
                            Move Down
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol> : <div></div>}
              </div>

              <div className='mt-4 mb-4'>
                <b>Selected Pages: {selectedPages.join(', ')}</b>
              </div >
              <div className='d-flex justify-content-center mb-5'>  <button className='btn btn-primary text-center' onClick={handleCreatePDF}>Create New PDF</button></div>

            </div>
          )}
        </div>
        <div>
          {newPdf && (
            <div>
              <b><h3>New PDF:</h3></b>
              <embed src={newPdf} width="500" height="600" type="application/pdf" />
              <div className='d-flex justify-content-center mb-5'>
                <button className='btn btn-primary text-center mt-4' onClick={handleSaveToBackend}>
                  Save PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  width: "500px",
  textAlign: "center"
};

export default Dashboard;
