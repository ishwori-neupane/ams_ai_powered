import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import background from '../../assets/Images/background.png';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import Bars from 'react-loading-icons/dist/esm/components/bars';
import { authenticate } from '../../authService/authService';
import { isAuthenticatedUser } from '../../authService/authService';

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const firstInputBoxRef = useRef();
  const [email, updateEmail] = useState('');
  const [password, updatePassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('email') &&
      localStorage.getItem('teacherStatus') == 1
    ) {
      let email = localStorage.getItem('email');
      let accessToken = localStorage.getItem('token');
      let roles = 'teacher';
      setAuth({ email, roles, accessToken });
      authenticate();
      navigate('/dashboard/teacher');
    }

    if (
      localStorage.getItem('token') &&
      localStorage.getItem('email') &&
      localStorage.getItem('studentStatus') == 1
    ) {
      let email = localStorage.getItem('email');
      let accessToken = localStorage.getItem('token');
      let roles = 'student';
      setAuth({ email, roles, accessToken });
      authenticate();
      navigate('/dashboard/student');
    }

    if (!isAuthenticatedUser()) navigate('/login');
  }, []);

  useEffect(() => {
    firstInputBoxRef.current.focus();
  }, []);

  const checkPattern = (pattern, str) => {
    let search = str.search(pattern);
    return search;
  };

  const onButtonClick = (e) => {
    e.preventDefault();
    let emailPattern = /^([a-z_A-Z]+)([0-9]*)(\.?)([0-9]*)(\@)([a-z_A-Z]+)(\.)([a-z_A-Z]+)(\.?)([a-z_A-Z]*)$/;
    let emailSearch = checkPattern(emailPattern, email);

    if (
      email !== '' &&
      password !== '' &&
      emailSearch === 0 &&
      password.length >= 8 &&
      password.length <= 24
    ) {
      postData();
    } else {
      if (email === '') {
        setErrMsg('Email is required');
      } else if (emailSearch !== 0) {
        setErrMsg('Invalid email format');
      } else if (password === '') {
        setErrMsg('Password is required');
      } else if (password.length < 8) {
        setErrMsg('Passwords must be at least 8 characters');
      } else if (password.length > 24) {
        setErrMsg('Passwords must be at most 24 characters');
      } else {
        setErrMsg('Invalid User');
      }
    }
  };

  const postData = async () => {
    setErrMsg('');
    setIsButtonLoading(true);
    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post('/signIn', JSON.stringify(formData), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const data = await response.data;
      const accessToken = response?.data?.token;
      const roles = response?.data?.role;
      localStorage.setItem('email', email);
      localStorage.setItem('token', accessToken);
      setAuth({ email, roles, accessToken });
      authenticate();
      if (data.role === 'student') {
        localStorage.setItem('studentStatus', 1);
        localStorage.removeItem('teacherStatus');
        navigate('/dashboard/student');
      } else if (data.role === 'teacher') {
        localStorage.setItem('teacherStatus', 1);
        localStorage.removeItem('studentStatus');
        navigate('/dashboard/teacher');
      } else {
        setErrMsg(data.message);
      }
      setIsButtonLoading(false);
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
      setIsButtonLoading(false);
    }
  };

  return (
    <div className='bg-cover bg-center bg-no-repeat bg-fixed md:h-screen md:w-screen md:flex md:justify-center md:items-center' style={{ backgroundImage: `url(${background})` }}>
      <div className='h-screen w-screen bg-discordBlack text-discordWhite py-10 px-6 md:h-auto md:w-1/3'>
        <h1 className='text-center text-2xl'>Welcome again!</h1>
        <h2 className='mb-4 text-center text-lg'>Glad to see you again</h2>
        {errMsg ? <p className='my-3 text-center text-red-500 bg-red-100 border border-red-400 rounded p-2'>{errMsg}</p> : <p className='my-3 text-center text-red-500 invisible'>this is something</p>}
        <p className='uppercase hidden md:block'>Email</p>
        <input type='email' className='bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0' required placeholder='email' onChange={(el) => { updateEmail(el.target.value); setErrMsg(''); }} ref={firstInputBoxRef}></input>
        <p className='uppercase hidden md:block'>Password</p>
        <input type='password' className='bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0' required placeholder='password' onChange={(el) => { updatePassword(el.target.value); setErrMsg(''); }}></input>
        <p className='mb-4'>Not a user, <span className='text-discordBlue underline'><Link to='/signup'>Sign Up</Link></span></p>
        <button className='bg-discordBlue text-discordWhite border-discordBlue rounded-none w-full p-2 flex justify-center h-10' onClick={onButtonClick}>{isButtonLoading ? <Bars className='w-5 h-5' style={{ width: '20px', height: '20px' }} /> : 'Login'}</button>
      </div>
    </div>
  );
};

export default Login;
