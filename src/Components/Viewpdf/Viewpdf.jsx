import React, { useEffect, useState } from 'react'
import './Viewpdf.css'
import axios from "axios";
import { apiurl } from "../Apiconfig/Apiconfig"


function Viewpdf() {

    var token = localStorage.getItem("token")
    var [pdfdata, setPdfdata] = useState([])


    useEffect(() => {

        //API to get all the PDF saved to Corresponding UserId
        axios.get(`${apiurl}/api/v1/home/getsavedpdf`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {
            if (res) {
                setPdfdata(res?.data?.message.data)
            }
        })
    }, [token])


    //Fuction to Fetch the Signed Url for Viewing the Saved PDF From S3 using The pathNmae
    const Viewpdf = (itm) => {
        axios.post(`${apiurl}/api/v1/home/fetchimage`, { pathname: itm }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((res) => {

            //If Signed Url present Open the File in New Tab
            if (res) {
                window.open(res?.data, '_blank');
            }
        }).catch((err) => {
            console.log(err.message)
        })
    }

    return (
        <div className='viewpdfhome'>

            <div>
                <div>
                    <ol>
                        {pdfdata.map((item, k) =>
                            <li className='pt-3'>
                                <div className='d-flex'>
                                    {/* Dispaly the File Name from PathName */}
                                    <div className='mt-2'><b>{item?.pdfdata && item.pdfdata.split('data/')[1]}</b></div>
                                    {/* On Clicking Download Button Fetch Signed Url using PathName */}
                                    <div><button onClick={() => { Viewpdf(item?.pdfdata) }} className='btn btn-danger mx-3'>Download</button></div>
                                </div>

                            </li>
                        )}
                    </ol>
                </div>
            </div>



        </div>
    )
}

export default Viewpdf