import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthProvider';
import { ToggleSlider } from "react-toggle-slider";
import { DarkModeSwitch } from 'react-toggle-dark-mode';

import './Setting.css';

const Setting = (props) => {
    const [lightMode, setLightMode] = useState(localStorage.getItem("lightMode") === "true");
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [active, setActive] = useState(false);
    const [isDarkMode, setDarkMode] = useState(!lightMode);

    useEffect(() => {
        if(active) props.notificationClick(false);
    }, [active]);

    const logout = async () => {
        setAuth({});
        localStorage.removeItem("password");
        localStorage.removeItem("email");
        navigate('/');
    };

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        setLightMode(!checked);
        localStorage.setItem("lightMode", !checked);
    };

    return (
        <div className='w-96 h-50 flex-col menu mt-10'>
            <h1 className='text-discordBlue mb-4 text-center text-3xl'>AG Settings</h1>
            <div className='flex justify-between my-4 w-full bg-gray-200 rounded-full px-5 py-3'>
                <h1 className='text-discordBlue text-2xl'>Theme</h1>
                <div className='bg-gray-500 p-1 w-10 h-10 rounded-full'>
                    <DarkModeSwitch
                        style={{ marginBottom: '2rem' }}
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        size={30}
                    />
                </div>
            </div>
            <div className='flex justify-between my-4 w-full bg-gray-200 rounded-full px-5 py-3'>
                <h1 className='text-discordBlue text-2xl'>Notifications</h1>
                <ToggleSlider onToggle={(state) => {
                    setActive(state);
                }} />
            </div>
            <div className='flex justify-center'>
                <button className='text-white border-2 border-discordBlue px-6 py-2 bg-discordBlue hover:text-discordBlue hover:bg-white rounded-full my-4' onClick={logout}>Logout</button>
            </div>
        </div>
    );
};

export default Setting;
