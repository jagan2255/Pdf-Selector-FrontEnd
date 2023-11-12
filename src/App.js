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
import { useState } from 'react';


function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);


  const PrivateRoute = ({ element }) => {
    const isAuthenticated = isLoggedIn;
    if (isAuthenticated) {
      return element;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />

        <Route path='/login' element={<Login />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App;
