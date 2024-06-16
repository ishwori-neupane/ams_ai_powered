import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const Classrooms = (props) => {
  const [classrooms, setClassrooms] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editClassroom, setEditClassroom] = useState({});

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/admin/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Failed to fetch classrooms', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/delete_classroom/${id}`);
      fetchClassrooms();
    } catch (error) {
      console.error('Failed to delete classroom', error);
    }
  };

  const handleEditClick = (classroom) => {
    setEditMode(true);
    setEditClassroom(classroom);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/update_classroom/${editClassroom.id}`, editClassroom);
      fetchClassrooms();
      setEditMode(false);
      setEditClassroom({});
    } catch (error) {
      console.error('Failed to update classroom', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditClassroom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let items = props.subjects.map((sub) => {
    return (
      <div
        key={sub}
        className='flex flex-col space-y-2 border-1 border-white shadow-discordBlue shadow-lg hover:shadow-md hover:shadow-discordBlue p-10 mb-20 cursor-pointer'
        onClick={() => {
          props.subjectClick(true);
          props.onSubjectClick(sub);
        }}
      >
        <div className='flex justify-center items-center w-32 h-32'>
          <h1 className='text-5xl text-discordBlue'>{sub}</h1>
        </div>
      </div>
    );
  });

  return (
    <>
      {props.subjects ? items : null}

      <div className="mt-10">
        <h2 className="text-2xl mb-4">Classroom Details</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="border px-4 py-2">Class ID</th>
              <th className="border px-4 py-2">Faculty</th>
              <th className="border px-4 py-2">Room No</th>
              <th className="border px-4 py-2">Semester</th>
              <th className="border px-4 py-2">Shift</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr key={classroom.id} className="bg-gray-200">
                <td className="border px-4 py-2">{classroom.classId}</td>
                <td className="border px-4 py-2">{classroom.faculty}</td>
                <td className="border px-4 py-2">{classroom.roomNo}</td>
                <td className="border px-4 py-2">{classroom.semester}</td>
                <td className="border px-4 py-2">{classroom.shift}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 mr-2"
                    onClick={() => handleEditClick(classroom)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1"
                    onClick={() => handleDelete(classroom.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editMode && (
        <div className="mt-10">
          <h2 className="text-2xl mb-4">Edit Classroom</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-white mb-2">Class ID</label>
              <input
                type="text"
                name="classId"
                value={editClassroom.classId}
                onChange={handleInputChange}
                className="w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Faculty</label>
              <input
                type="text"
                name="faculty"
                value={editClassroom.faculty}
                onChange={handleInputChange}
                className="w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Room No</label>
              <input
                type="text"
                name="roomNo"
                value={editClassroom.roomNo}
                onChange={handleInputChange}
                className="w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Semester</label>
              <input
                type="text"
                name="semester"
                value={editClassroom.semester}
                onChange={handleInputChange}
                className="w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Shift</label>
              <input
                type="text"
                name="shift"
                value={editClassroom.shift}
                onChange={handleInputChange}
                className="w-full p-2"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2"
            >
              Update
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Classrooms;
