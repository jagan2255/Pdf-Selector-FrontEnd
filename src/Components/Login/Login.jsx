import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { apiurl } from '../Apiconfig/Apiconfig';
import axios from 'axios';



function Login() {
  const history = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');



  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
    setLoginError('')
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
    setLoginError('')
  };


  const signin = async (e) => {
    e.preventDefault()

    // Validate name
    if (!(email.trim())) {
      setEmailError('Please enter your email.');
      return;
    }

    if (!password) {
      setPasswordError('Please enter your Password.');
      return;
    }


    await axios.post(`${apiurl}/api/v1/auth/login`, {
      email: email,
      password: password,
    })
      .then((res) => {
        console.log(res?.data?.message?.code)
        if (res?.data?.message?.code === "Success") {

          console.log(res?.data?.message?.user)
          var token = res?.data?.message?.user?.token
          var refreshToken = res?.data?.message?.user?.refreshToken
          localStorage.setItem("token", token)
          localStorage.setItem("refreshToken", refreshToken)
          history("/")

        } else {
          setLoginError(res?.data?.message?.message)
        }
      })
      .catch((err) => {
        console.log(err.message)
        setLoginError(err.message)
      });
  }

  return (
    <div className='d-flex justify-content-center align-item-center bbb'>

      <div className='homw11'>

        <form className='forms123' onSubmit={signin}>

          <div className="mb-3 text-center">
            <img src="https://logos-world.net/wp-content/uploads/2022/04/OLX-Symbol.png" width="80px" alt="" /><br />
          </div>
          {loginError && <div className="text-danger text-center">{loginError}</div>}


          <div className="mb-3 mt-5">
            <label for="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" minLength={8} name="email" value={email} onChange={(e) => handleEmailChange(e)} className="form-control" id="email" />
            {emailError && <div className="text-danger">{emailError}</div>}
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" value={password} name="password" onChange={(e) => handlePasswordChange(e)} className="form-control" id="password" />
            {passwordError && <div className="text-danger">{passwordError}</div>}

          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
            <label className="form-check-label" for="exampleCheck1">Remember me</label>
          </div>
          <div className='d-grid'>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
          <div className="text-center mt-4">
            <p>Not a member? <Link to="/signup">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login