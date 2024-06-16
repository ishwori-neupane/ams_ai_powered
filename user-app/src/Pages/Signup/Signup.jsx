import React, { useState, useRef, useEffect, useContext } from 'react'
import axios from '../../api/axios'
import { Link, useNavigate } from 'react-router-dom'
import background from '../../assets/Images/background.png'
import Bars from 'react-loading-icons/dist/esm/components/bars';

import AuthContext from '../../context/AuthProvider';

import { authenticate } from '../../authService/authService';

import { isAuthenticatedUser } from '../../authService/authService';


const Signup = () => {
    const {setAuth} = useContext(AuthContext);

    const firstInputBoxRef = useRef(null);

    useEffect(() => {
        firstInputBoxRef.current.focus();
    }, [])

    const navigate = useNavigate();

    const [username, updateUserName] = useState(null);
    const [email, updateEmail] = useState(null);
    const [password, updatePassword] = useState(null);
    const [confirmPassword, updateConfirmPassword] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const [isButtonLoading, setIsButtonLoading] = useState(false);


    const checkPattern = (pattern , str) => {
        let search = str.search(pattern);
        return search;
    }

    const onButtonClick = (e) => {
        let namePattern = /^[a-z_A-Z ]{3,30}$/
        let emailPattern = /^([a-z_A-Z]+)([0-9]*)(\.?)([0-9]*)(\@)([a-z_A-Z]+)(\.)([a-z_A-Z]+)(\.?)([a-z_A-Z]*)$/;

        let nameSearch = checkPattern(namePattern, username);
        let emailSearch = checkPattern(emailPattern, email)
        if(email !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword && emailSearch === 0 && nameSearch === 0 && password.length>=8 && confirmPassword.length>=8 && password.length<=24 && confirmPassword.length<=24){
            e.preventDefault();
            postData();
        }
        if(password !== '' && confirmPassword !== '' && password !== confirmPassword){
            setErrMsg("Two Passwords not matching");
        }
        if(password.length < 8 || confirmPassword.length < 8){
            setErrMsg('Passwords must be at least of 8 characters');
        }
        if(password.length > 24 || confirmPassword.length > 24){
            setErrMsg('Passwords must be at most of 24 characters');
        }

        if(nameSearch !== 0){
            setErrMsg("Name should be between 3 to 30 characters")
        }
    }

    const postData = async () => {
        setErrMsg('');
        setIsButtonLoading(true);
        const formData = {
            name : username,
            email : email,
            password : password,
        }

        try{
            const response = await axios.post("/signup", 
            JSON.stringify(formData), 
            {
                headers : {'Content-Type' : 'application/json'},
                withCredentials : true
            });
            const data = await response.data;
            setIsButtonLoading(false);
            if(data.message === 'OTP'){
                navigate('/signup/otp-verification');
            }else{
                setErrMsg(data.message);
            }
            console.log(data);
        }catch(error){
            if (!error?.response){
                setErrMsg('No Server Response');
            }else if (error.response?.status === 400){
                setErrMsg('Missing Email or Password');
            }else if (error.response?.status === 401) {
                setErrMsg('Unauthorized');
            }else {
                setErrMsg('Login Failed');
            }
            setIsButtonLoading(false);
        }
    }

    useEffect(() => {
        if(localStorage.getItem("token") && localStorage.getItem("email")  && localStorage.getItem("teacherStatus") == 1){
          let email = localStorage.getItem("email");
          let accessToken = localStorage.getItem("token");
          let roles = 'teacher';
          setAuth({email,roles,accessToken});
          authenticate();
          navigate('/dashboard/teacher')
        }
    
        if(localStorage.getItem("token") && localStorage.getItem("email") && localStorage.getItem("studentStatus") == 1){
          let email = localStorage.getItem("email");
          let accessToken = localStorage.getItem("token");
          let roles = 'student';
          setAuth({email,roles,accessToken});
          authenticate();
          navigate('/dashboard/student')
        }
    
        if(!isAuthenticatedUser()) navigate('/signup');
      },[])
    
    return (
        <div className='bg-cover bg-center bg-no-repeat bg-fixed md:h-screen md:w-screen md:flex md:justify-center md:items-center' style={{backgroundImage : `url(${background})`}}>
            <div className='h-screen w-screen bg-discordBlack text-discordWhite py-10 px-6 md:w-1/3 md:h-auto'>
                <h1 className='text-center text-2xl'>Namaste</h1>
                <h2 className='mb-4 text-center text-lg'>Glad to see you for the first time!</h2>
                {(errMsg)?<p className='my-3 text-center text-red-500'>{errMsg}</p>:<p className='my-3 text-center text-red-500 invisible'>this is something</p>}
                <p className='uppercase hidden md:block'>Name</p>
                <input type="text" className='bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0' required placeholder='Name' onChange={(el) => updateUserName(el.target.value)} ref={firstInputBoxRef}></input>
                <p className='uppercase hidden md:block'>Email</p>
                <input ref={firstInputBoxRef} type="email" className='bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0' required placeholder='email' onChange={(el) => {updateEmail(el.target.value); setErrMsg('')}}></input>
                <p className='uppercase hidden md:block'>Password</p>
                <input type="password" className='bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0' required placeholder='Password' onChange={(el) => {updatePassword(el.target.value); setErrMsg('')}}></input>
                <p className='uppercase hidden md:block'>Confirm Password</p>
                <input type="password" className='bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0' required placeholder='Confirm Password' onChange={(el) => {updateConfirmPassword(el.target.value); setErrMsg('')}}></input>
                <p className='mb-4'>Already a user? <span className='text-discordBlue underline'><Link to="/login">Log In</Link></span></p>
                <button className='bg-discordBlue text-discordWhite border-discordBlue rounded-none w-full p-2 flex justify-center h-10' onClick={onButtonClick}>{(isButtonLoading)?<Bars className='w-5 h-5' style={{width : '20px', height:'20px'}} />:"Signup"}</button>
            </div>
        </div>
    )
}

export default Signup
