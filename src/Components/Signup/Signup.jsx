import React, { useState } from 'react'
import '../Login/Login.css';
import { useNavigate } from "react-router-dom";
import { apiurl } from '../Apiconfig/Apiconfig';
const axios = require('axios').default;



function Signup() {
    const history = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState();
    const [username, setUsername] = useState('');



    const signup22 = (e) => {
        e.preventDefault()

        axios.post(`${apiurl}/signup`, {
            email: email,
            password: password,
            phonenumber: phone,
            username: username
        })
            .then((res) => {
                if (res) {
                    alert("Sucessfully Created")
                    history("/login")
                } else {
                    alert("Error")

                }
            })
            .catch(function (error) {
                alert(error);
            });

    }


    return (
        <div className='d-flex justify-content-center align-item-center bbb signupqaz'>
            <div className='sss'>
                <form className='forms123' onSubmit={signup22}>

                    <div className="mb-3 text-center">
                        <img src="https://logos-world.net/wp-content/uploads/2022/04/OLX-Symbol.png" width="80px" alt="" /><br />
                    </div>

                    <div className="mb-3 mt-5">
                        <label for="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" required value={email} name="email" onChange={(e) => setEmail(e.target.value)} id="exampleInputEmail1" aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">User Name</label>
                        <input type="text" required value={username} name="username" onChange={(e) => setUsername(e.target.value)} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input type="number" required value={phone} name="phone" onChange={(e) => setPhone(e.target.value)} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" required value={password} name="password" onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" />
                    </div>
                    <div className="mb-3 form-check">
                        <input required type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" for="exampleCheck1">Terms and Conditions</label>
                    </div>
                    <div className='d-grid'>
                        <button type="submit" className="btn btn-primary">SignUp</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup