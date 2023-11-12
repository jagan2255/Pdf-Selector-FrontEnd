import React, { useState } from 'react';
import './Login.css';
import {Link, useNavigate} from 'react-router-dom';
import { apiurl } from '../Apiconfig/Apiconfig';
const axios = require('axios').default;



function Login() {
  const history = useNavigate();

const [email , setEmail] = useState('');
const [password , setPassword] = useState('')

const signup=(e)=>{
  e.preventDefault()

  axios.post(`${apiurl}/login`, {
      email: email,
      password: password,
    })
    .then((res)=> {
      console.log(res)
   if(!res.data.status){
    alert(res.data.data)

   }else{
    localStorage.setItem("name" , res.data.name)
    localStorage.setItem("token" , res.data.token)
    localStorage.setItem("token2" , res.data.tokens)

    history("/")
    window.location.reload();

   }
    })
    .catch(function (error) {
      alert(error);
    });
}

  return (
    <div className='d-flex justify-content-center align-item-center bbb'>
        <div className='homw11'>
        <form className='forms123' onSubmit={signup}>

    <div className="mb-3 text-center">
        <img src="https://logos-world.net/wp-content/uploads/2022/04/OLX-Symbol.png" width="80px" alt="" /><br/>
  </div>

  <div className="mb-3 mt-5">
    <label for="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" required minLength={8} name="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" id="email"/>
  </div>
  <div className="mb-3">
    <label for="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" required value={password} name="password" onChange={(e)=>setPassword(e.target.value)} className="form-control" id="password"/>
  </div>
  <div className="mb-3 form-check">
    <input  type="checkbox" className="form-check-input" id="exampleCheck1"/>
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