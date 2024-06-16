// ClassroomCard.jsx

import React, { useState, useEffect, useRef } from 'react';
import axiosInstance, { axiosPrivate, setAuthToken } from '../../../api/axios';
import { Bars } from 'react-loading-icons';

const ClassroomCard = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [classId, setClassId] = useState('');
    const [faculty, setFaculty] = useState('');
    const [roomNo, setRoomNo] = useState('');
    const [semester, setSemester] = useState('');
    const [shift, setShift] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const firstInputBoxRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        setAuthToken(token);
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await axiosPrivate.get('/admin/classroom');
            setClassrooms(response.data);
        } catch (error) {
            console.error('Failed to fetch classrooms', error);
            setErrMsg('Failed to fetch classrooms');
        }
    };

    const onAddClassroomClicked = async () => {
        setIsButtonLoading(true);
        try {
            const formData = {
                classId: parseInt(classId, 10),
                faculty,
                roomNo: parseInt(roomNo, 10),
                semester: parseInt(semester, 10),
                shift
            };

            const response = isEditing
                ? await axiosPrivate.put(`/admin/classroom/${editId}`, formData)
                : await axiosPrivate.post('/admin/classroom', formData);

            const data = response.data;
            setIsButtonLoading(false);
            if (data === 'Classroom added successfully' || data === 'Classroom updated successfully') {
                setErrMsg('');
                setClassId('');
                setFaculty('');
                setRoomNo('');
                setSemester('');
                setShift('');
                setIsEditing(false);
                fetchClassrooms();
            } else {
                setErrMsg(data);
            }
        } catch (error) {
            setIsButtonLoading(false);
            setErrMsg('Unable to add or update');
        }
    };

    const onEditClicked = (classroom) => {
        setClassId(classroom.classId);
        setFaculty(classroom.faculty);
        setRoomNo(classroom.roomNo);
        setSemester(classroom.semester);
        setShift(classroom.shift);
        setIsEditing(true);
        setEditId(classroom.id);
    };

    const onDeleteClicked = async (id) => {
        try {
            await axiosPrivate.delete(`/admin/classroom/${id}`);
            fetchClassrooms();
        } catch (error) {
            console.error('Failed to delete classroom', error);
        }
    };

    const onButtonClick = (e) => {
        e.preventDefault();
        if (
            classId.trim() !== '' &&
            faculty.trim() !== '' &&
            roomNo.trim() !== '' &&
            semester.trim() !== '' &&
            shift.trim() !== ''
        ) {
            onAddClassroomClicked();
        } else {
            setErrMsg('Input Box should not be empty');
        }
    };

    return (
        <div className="h-screen w-screen bg-discordBlack text-discordWhite py-10 px-6 md:h-auto md:w-1/3 shadow-md shadow-discordBlack absolute top-16">
            <h1 className="text-center text-2xl">Add Classroom</h1>
            {errMsg ? (
                <p className="my-3 text-center text-red-500">{errMsg}</p>
            ) : (
                <p className="my-3 text-center text-red-500 invisible">this is something</p>
            )}
            <p className="uppercase hidden md:block">Class ID</p>
            <input
                type="text"
                className="bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0"
                required
                placeholder="Class ID"
                onChange={(el) => {
                    setClassId(el.target.value);
                    setErrMsg('');
                }}
                ref={firstInputBoxRef}
                value={classId}
            />
            <p className="uppercase hidden md:block">Faculty</p>
            <input
                type="text"
                className="bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0"
                required
                placeholder="Faculty"
                onChange={(el) => {
                    setFaculty(el.target.value);
                    setErrMsg('');
                }}
                value={faculty}
            />
            <p className="uppercase hidden md:block">Room No</p>
            <input
                type="text"
                className="bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0"
                required
                placeholder="Room No"
                onChange={(el) => {
                    setRoomNo(el.target.value);
                    setErrMsg('');
                }}
                value={roomNo}
            />
            <p className="uppercase hidden md:block">Semester</p>
            <input
                type="text"
                className="bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0"
                required
                placeholder="Semester"
                onChange={(el) => {
                    setSemester(el.target.value);
                    setErrMsg('');
                }}
                value={semester}
            />
            <p className="uppercase hidden md:block">Shift</p>
            <input
                type="text"
                className="bg-discordDarkBlack w-full placeholder:uppercase mb-3 p-2 outline-none md:placeholder:opacity-0"
                required
                placeholder="Shift"
                onChange={(el) => {
                    setShift(el.target.value);
                    setErrMsg('');
                }}
                value={shift}
            />
            <button
                className="bg-discordBlue text-discordWhite border-discordBlue rounded-none w-full p-2 flex justify-center h-10"
                onClick={onButtonClick}
            >
                {isButtonLoading ? <Bars className="w-5 h-5" style={{ width: '20px', height: '20px' }} /> : 'Add'}
            </button>
        </div>
    );
};

export default ClassroomCard;
