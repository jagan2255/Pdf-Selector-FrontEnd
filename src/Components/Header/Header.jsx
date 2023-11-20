import React from 'react';
import "./Header.css"


function Header() {


    var token = localStorage.getItem("token")

    //Logout Handle
    const logoutuser = () => {
        localStorage.clear()
        window.location.replace("/")
    }

    //Login Handle
    const loginuser = () => {
        window.location.replace("/login")
    }
    //Signup Handle
    const logout = () => {
        window.location.replace("/signup")
    }

    //Redirect to View Sade PDF Page
    const savedpdf = () => {
        window.location.replace("/viewpdf")
    }

    //Redirect to Home Page
    const home = () => {
        window.location.replace("/")
    }


    return (

        <div>
            <div className='headermain'>
                <div className='homechild'><h2>PDF Reader</h2></div>
                {token ?
                    <div className='d-flex mt-2'>
                        <div><button onClick={home} className='btn btn-warning  btn-borderd'>Home</button></div>
                        <div className='mx-2 me-3'><button onClick={savedpdf} className='btn btn-warning  btn-borderd'>Saved Pdf</button></div>
                        <div className='mx-5 me-5'><button onClick={() => { logoutuser() }} className='btn btn-danger  btn-borderd'>Logout</button></div>
                    </div> :
                    <div className='d-flex mt-2'>
                        <div className='mx-1'><button onClick={loginuser} className='btn btn-primary  btn-borderd'>Login</button></div>
                        <div className='mx-3 me-5'><button onClick={logout} className='btn btn-primary  btn-borderd'>SignUp</button></div>
                    </div>}


            </div>


        </div>
    )
}

export default Header