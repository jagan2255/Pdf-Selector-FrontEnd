import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
}
  from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login/Login';
import { useEffect, useState } from 'react';
import Signup from './Components/Signup/Signup';
import Viewpdf from './Components/Viewpdf/Viewpdf';


function App() {

  var token = localStorage.getItem('token')
  var refreshToken = localStorage.getItem('refreshToken')
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isTokenCheckComplete, setTokenCheckComplete] = useState(false);

  //Check Token is Present or Not
  useEffect(() => {
    const checkToken = async () => {
      console.log('Token:', token);
      setLoggedIn(!!token);
      setTokenCheckComplete(true);
    };

    checkToken();
  }, [token]);;


//If Token is not present Redirect to Login
  const PrivateRoute = ({ element }) => {
    if (isTokenCheckComplete) {
      return isLoggedIn ? element : <Navigate to="/login" />;
    } else {
      return null;
    }
  };

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/viewpdf" element={<PrivateRoute element={<Viewpdf/>} />} />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
