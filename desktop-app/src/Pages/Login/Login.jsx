import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import background from '../../assets/Images/background.png';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthProvider';
import Bars from 'react-loading-icons/dist/esm/components/bars';
import { isAuthenticatedUser, authenticate } from '../../authService/authService';

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const firstInputBoxRef = useRef();

  const [email, updateEmail] = useState('');
  const [password, updatePassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    firstInputBoxRef.current.focus();
  }, []);

  const onButtonClick = (e) => {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setErrMsg("Email and password are required.");
      return;
    }
    setIsButtonLoading(true);
    postData();
  };

  const postData = async () => {
    setErrMsg('');
    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("/signIn",
        JSON.stringify(formData),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      const data = await response.data;

      if (data.statusText !== null) {
        navigate('/dashboard/admin');
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        setAuth({ email, password });
        authenticate();
      } else {
        setErrMsg(data);
      }
    } catch (error) {
      if (!error?.response) {
        setErrMsg('No Server Response');
      } else if (error.response?.status === 400) {
        setErrMsg('Missing Email or Password');
      } else if (error.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
    setIsButtonLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("email") && localStorage.getItem("password")) {
      let email = localStorage.getItem("email");
      let password = localStorage.getItem("password");
      setAuth({ email, password });
      authenticate();
      navigate("/dashboard/admin");
    }

    if (!isAuthenticatedUser()) navigate('/');
  }, [setAuth, navigate]);

  return (
    <div className='bg-cover bg-center bg-no-repeat bg-fixed md:h-screen md:w-screen md:flex md:justify-center md:items-center' style={{ backgroundImage: `url(${background})` }}>
      <div className='h-screen w-screen bg-discordBlack text-discordWhite py-10 px-6 md:h-auto md:w-1/3'>
        <h1 className='text-center text-2xl'>Welcome Admin!</h1>
        <h2 className='mb-4 text-center text-lg'>Glad to see you again</h2>
        {errMsg && (
          <div className='my-3 text-center text-red-500'>
            <p>Error Message: {errMsg}</p>
          </div>
        )}
        <p className='uppercase hidden md:block'>Username</p>
        <input
          type="text"
          className='bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0'
          required
          placeholder='email'
          onChange={(el) => { updateEmail(el.target.value); setErrMsg(''); }}
          ref={firstInputBoxRef}
        />
        <p className='uppercase hidden md:block'>Password</p>
        <input
          type="password"
          className='bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0'
          required
          placeholder='password'
          onChange={(el) => { updatePassword(el.target.value); setErrMsg(''); }}
        />
        <button
          className='bg-discordBlue text-discordWhite border-discordBlue rounded-none w-full p-2 flex justify-center h-10'
          type='button'
          onClick={onButtonClick}
        >
          {isButtonLoading ? <Bars className='w-5 h-5' style={{ width: '20px', height: '20px' }} /> : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
