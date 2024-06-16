import React, { useState, useEffect, useContext } from 'react';
import SidebarItem from '../../Components/Searchbar/SidebarItem/SidebarItem';
import Searchbar from '../../Components/Searchbar/Searchbar/Searchbar';
import UserProfileSidebar from '../../Components/Searchbar/UserProfileSidebar/UserProfileSidebar';
import logo from '../../assets/Images/812c4623-0d1f-4228-8d5f-609bb5a7c026-fotor-bg-remover-20240614152735.png';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Dashboard from '../DashboardPages/Dashboard/Dashboard';
import LineChartComp from '../../Components/Searchbar/LineChart/LineChart';
import SubjectPie from '../../Components/Searchbar/SubjectPie/SubjectPie';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import Classrooms from '../DashboardPages/Classrooms/Classrooms';
import Students from '../DashboardPages/Students/Students';
import Teachers from '../DashboardPages/Teachers/Teachers';
import ClassroomCard from '../../Components/Searchbar/ClassroomCard/ClassroomCard';
import SubjectInfoCard from '../../Components/SubjectInfoCard/SubjectInfoCard';
import Toastify from '../../Components/Toastify/Toastify';
import ProfileCard from '../../Components/ProfileCard/ProfileCard';
import Setting from '../../Components/Setting/Setting';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import StudentCard from '../../Components/Searchbar/StudentCard/StudentCard';
import { isAuthenticatedUser } from '../../authService/authService';
import { authenticate } from '../../authService/authService';
import AuthContext from '../../context/AuthProvider';
import Bars from 'react-loading-icons/dist/esm/components/bars';

const AdminDashboard = () => {
  const { setAuth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(true);
  const [dashboardClicked, setDashboardClicked] = useState(true);
  const [classroomsClicked, setClassroomsClicked] = useState(false);
  const [teachersClicked, setTeachersClicked] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);
  const [studentsClicked, setStudentsClicked] = useState(false);
  const [settingClicked, setSettingClicked] = useState(false);
  const [semesterSelect, setSemesterSelect] = useState(2);
  const [studentSemesterSelect, setStudentSemesterSelect] = useState('');
  const [addClassroomClicked, updateAddClassroomClicked] = useState(false);
  const [addStudentClicked, updateAddStudentClicked] = useState(false);
  const [subjectClick, setSubjectClick] = useState(false);
  const [notificationClick, onNotificationClick] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [teachersList, setTeachersList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStudentsOnStudentsClicked = async () => {
    const formData = {
      semester: 6,
      shift: 'M'
    };
    try {
      const response = await axiosPrivate.post('/admin/get_students', formData);
      const data = await response.data;
      console.log(data);
      setStudentsList([...data]);
    } catch (error) {
      console.log(error);
    }
  };

  const getClassroomOnClassroomsClicked = async () => {
    const formData = {
      semester: 6,
      shift: 'M'
    };
    try {
      const response = await axiosPrivate.post('/admin/subjects/details', formData);
      const data = await response.data;
      console.log(data);
      setSubjects([...data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('Semester : ', studentSemesterSelect[0], 'Shift : ', studentSemesterSelect[1]);
  }, [studentSemesterSelect]);

  const getTeachersList = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get('admin/all_teachers');
      const data = await response.data;
      console.log(data);
      setTeachersList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDashboardClicked = () => {
    setDashboardClicked(true);
    setClassroomsClicked(false);
    setTeachersClicked(false);
    setStudentsClicked(false);
    setSettingClicked(false);
    setProfileClicked(false);
  };

  const onClassroomsClicked = () => {
    setDashboardClicked(false);
    setClassroomsClicked(true);
    setTeachersClicked(false);
    setStudentsClicked(false);
    setSettingClicked(false);
    setProfileClicked(false);
    getClassroomOnClassroomsClicked();
  };

  const onTeachersClicked = () => {
    setDashboardClicked(false);
    setClassroomsClicked(false);
    setTeachersClicked(true);
    setStudentsClicked(false);
    setSettingClicked(false);
    setProfileClicked(false);
    getTeachersList();
  };

  const onStudentsClicked = () => {
    setDashboardClicked(false);
    setClassroomsClicked(false);
    setTeachersClicked(false);
    setStudentsClicked(true);
    setSettingClicked(false);
    setProfileClicked(false);
    getStudentsOnStudentsClicked();
  };

  const onSettingClicked = () => {
    setDashboardClicked(false);
    setClassroomsClicked(false);
    setTeachersClicked(false);
    setStudentsClicked(false);
    setSettingClicked(true);
    setProfileClicked(false);
  };

  const transparent = (
    <div
      className="opacity-70 w-full h-full bg-gray-200 dark:bg-darkTransparent z-0 absolute"
      onClick={() => {
        updateAddClassroomClicked(false);
        setSubjectClick(false);
        updateAddStudentClicked(false);
      }}
    ></div>
  );

  const onSubjectClick = async (sub) => {
    const formData = {
      semester: 6,
      shift: 'M',
      sub_name: sub
    };
    try {
      const response = await axiosPrivate.post('admin/get_sub_details', formData);
      const data = await response.data;
      console.log(data);
      setSubjectDetails(data);
    } catch (error) {
      console.log(error);
      setSubjectClick(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('email') && localStorage.getItem('password')) {
      let email = localStorage.getItem('email');
      let password = localStorage.getItem('token');
      setAuth({ email, password });
      authenticate();
    }
    if (!isAuthenticatedUser()) navigate('/');
  }, []);

  return (
    <>
      {notificationClick ? <Toastify notify={notificationClick} msg="Login Successful" /> : null}
      <div className="hidden md:flex md:h-screen md:w-screen md:justify-between md:overflow-hidden">
        {/* Sidebar */}
        <div className="basis-1/6 dark:bg-darkLeftSidebar">
          {/* Project Logo */}
          <div className="flex justify-center py-6 px-2 items-center cursor-pointer space-x-2 ">
            <img alt="attendance guru logo" src={`${logo}`} className="w-35 h-35" />
          </div>
          <div>
            <SidebarItem
              muiIcon={<HomeIcon />}
              itemText="Dashboard"
              textSize="text-lg"
              onClick={onDashboardClicked}
              leftBorder={dashboardClicked ? 'border-r-4 border-r-discordBlue bg-gray-300' : ''}
            />
            <SidebarItem
              muiIcon={<SchoolIcon />}
              itemText="ClassRooms"
              textSize="text-lg"
              onClick={onClassroomsClicked}
              leftBorder={classroomsClicked ? 'border-r-4 border-r-discordBlue bg-gray-300' : ''}
            />
            <SidebarItem
              muiIcon={<PersonIcon />}
              itemText="Teachers"
              textSize="text-lg"
              onClick={onTeachersClicked}
              leftBorder={teachersClicked ? 'border-r-4 border-r-discordBlue bg-gray-300' : ''}
            />
            <SidebarItem
              muiIcon={<PersonIcon />}
              itemText="Students"
              textSize="text-lg"
              onClick={onStudentsClicked}
              leftBorder={studentsClicked ? 'border-r-4 border-r-discordBlue bg-gray-300' : ''}
            />
            <SidebarItem
              muiIcon={<SettingsIcon />}
              itemText="Setting"
              textSize="text-lg"
              onClick={onSettingClicked}
              leftBorder={settingClicked ? 'border-r-4 border-r-discordBlue bg-gray-300' : ''}
            />
          </div>
        </div>

        {/* middle section */}
        <div className="basis-5/6 bg-gray-100 pb-10 dark:bg-darkMiddlebar">
          {/* Searchbar */}
          <div className="w-full flex items-center py-4 bg-gray-300 dark:bg-darkMiddlebar">
            <Searchbar />
            <div className="relative">
              <UserProfileSidebar profileClick={setProfileClicked} notificationClick={onNotificationClick} />
              {profileClicked ? <ProfileCard onSettingClicked={onSettingClicked} profileClicked={setProfileClicked} /> : null}
            </div>
          </div>

          {dashboardClicked ? (
            <>
              <h1 className="text-2xl text-discordBlue text-center mt-2">Dashboard</h1>
              <div className="my-6">
                <h3 className="text-lg text-discordBlue text-center mb-1">Attendance Overview</h3>
                <LineChartComp />
              </div>

              {/* Subject Pies */}
              <div>
                <h3 className="text-center text-lg text-discordBlue mb-4">Attendance per Subject</h3>
                <div className="flex w-full justify-center space-x-5">
                  <div className="flex flex-col space-y-2">
                    <SubjectPie percentage={80} subjectName="PPL" widthHeight="w-32 h-32" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <SubjectPie percentage={75} subjectName="CN" widthHeight="w-32 h-32" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <SubjectPie percentage={65} subjectName="EE" widthHeight="w-32 h-32" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <SubjectPie percentage={70} subjectName="OOSD" widthHeight="w-32 h-32" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <SubjectPie percentage={85} subjectName="MMS" widthHeight="w-32 h-32" />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {classroomsClicked ? (
            <div className="w-full h-full relative">
              {addClassroomClicked ? (
                <>
                  {transparent}
                  <div className="w-full h-full flex justify-center items-center">
                    <ClassroomCard className="z-10" semester={semesterSelect[0]} shift={semesterSelect[1]} off={updateAddClassroomClicked} />
                  </div>
                </>
              ) : null}
              {subjectClick ? (
                <>
                  {transparent}
                  <div className="w-full h-full flex justify-center items-center">
                    <SubjectInfoCard className="z-10" subjectDetails={subjectDetails} />
                  </div>
                </>
              ) : null}
              {!addClassroomClicked && !subjectClick ? (
                <>
                  <h1 className="text-center text-2xl text-discordBlue my-4 mb-8">Classes</h1>
                  <div className="my-5 text-xl text-center text-discordBlue border-discordBlue outline-discordBlue">
                    <select onChange={(e) => setSemesterSelect(e.target.value)}>
                      <option value="6M" selected>
                        Semester 6 Morning
                      </option>
                    </select>
                  </div>
                  <div className="flex w-full justify-center space-x-5 flex-wrap relative">
                    <>
                      <div
                        className="flex flex-col space-y-2 border-1 border-white shadow-discordBlue shadow-lg hover:shadow-md hover:shadow-discordBlue p-10 mb-20 cursor-pointer"
                        onClick={() => updateAddClassroomClicked(true)}
                      >
                        <div className="text-8xl text-center text-discordBlue">+</div>
                        <h1 className="text-2xl text-discordBlue">Add Classroom</h1>
                      </div>
                      {<Classrooms subjectClick={setSubjectClick} subjects={subjects} onSubjectClick={onSubjectClick} />}
                    </>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {teachersClicked ? (
            <div className="px-20 w-full h-full">
              <h1 className="text-center text-2xl text-discordBlue my-4 mb-8">List of Teachers</h1>
              {loading ? (
                <div className="flex justify-center items-center">
                  <Bars className="w-10 h-10" style={{ width: '40px', height: '40px' }} />
                </div>
              ) : (
                <Teachers teachers={teachersList} />
              )}
            </div>
          ) : null}

          {studentsClicked ? (
            <div className="px-20 w-full h-full relative">
              {addStudentClicked ? (
                <>
                  {transparent}
                  <div className="w-full h-full flex justify-center items-center">
                    <StudentCard className="z-10" semester={6} shift={'M'} off={updateAddStudentClicked} />
                  </div>
                </>
              ) : null}
              {!addStudentClicked ? (
                <>
                  <h1 className="text-center text-2xl text-discordBlue my-4 mb-8">List of Students</h1>
                  <div className="my-5 text-xl text-center text-discordBlue border-discordBlue outline-discordBlue">
                    <div className="flex w-full justify-center items-center mt-5 mb-0">
                      <div
                        className="flex w-52 h-5 space-y-2 border-1 items-center space-x-2 border-white shadow-discordBlue shadow-lg hover:shadow-md hover:shadow-discordBlue p-10 cursor-pointer"
                        onClick={() => updateAddStudentClicked(true)}
                      >
                        <div className="text-2xl text-center text-discordBlue">+</div>
                        <h1 className="text-xl text-discordBlue">Add Student</h1>
                      </div>
                    </div>
                  </div>
                  <Students students={studentsList} />
                </>
              ) : null}
            </div>
          ) : null}

          {settingClicked ? (
            <div className="w-full h-full flex justify-center">
              <Setting notificationClick={onNotificationClick} />
            </div>
          ) : null}
        </div>
      </div>

      {/* For smaller Device */}
      <div className="h-screen w-screen no-scrollbar md:hidden">
        <div className="p-3 flex items-center justify-between">
          {/* handwritten logo */}
          <div className="w-40 cursor-pointer justify-self-start">
            <img src={logo} alt="attendance guru logo" />
          </div>
          {/* hamburger icon */}
          <div className="text-discordBlue text-md justify-self-end dark:text-white" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <MenuIcon /> : <CloseIcon />}
          </div>
        </div>

        {/* sidebar items */}
        {!showMenu ? (
          <div>
            <SidebarItem itemText="Dashboard" textSize="text-lg" onClick={onDashboardClicked} leftBorder={dashboardClicked ? 'border-l-4 border-l-discordBlue bg-gray-100' : ''} />
            <SidebarItem itemText="ClassRooms" textSize="text-lg" onClick={onClassroomsClicked} leftBorder={classroomsClicked ? 'border-l-4 border-l-discordBlue bg-gray-100' : ''} />
            <SidebarItem itemText="Teachers" textSize="text-lg" onClick={onTeachersClicked} leftBorder={teachersClicked ? 'border-l-4 border-l-discordBlue bg-gray-100' : ''} />
            <SidebarItem itemText="Students" textSize="text-lg" onClick={onStudentsClicked} leftBorder={studentsClicked ? 'border-l-4 border-l-discordBlue bg-gray-100' : ''} />
            <SidebarItem itemText="Setting" textSize="text-lg" onClick={onSettingClicked} leftBorder={settingClicked ? 'border-l-4 border-l-discordBlue bg-gray-100' : ''} />
          </div>
        ) : null}

        {showMenu && dashboardClicked ? (
          <div className="w-full">
            <h3 className="text-lg text-discordBlue text-center mb-1">Attendance Overview</h3>
            <LineChartComp />
            <div>
              <h3 className="text-center text-lg text-discordBlue mb-4">Attendance per Subject</h3>
              <div className="flex w-full justify-center space-x-5 flex-wrap px-20">
                <div className="flex flex-col space-y-2">
                  <SubjectPie percentage={80} subjectName="PPL" widthHeight="w-40 h-40" />
                </div>
                <div className="flex flex-col space-y-2">
                  <SubjectPie percentage={75} subjectName="CN" widthHeight="w-40 h-40" />
                </div>
                <div className="flex flex-col space-y-2">
                  <SubjectPie percentage={65} subjectName="EE" widthHeight="w-40 h-40" />
                </div>
                <div className="flex flex-col space-y-2">
                  <SubjectPie percentage={70} subjectName="OOSD" widthHeight="w-40 h-40" />
                </div>
                <div className="flex flex-col space-y-2">
                  <SubjectPie percentage={85} subjectName="MMS" widthHeight="w-40 h-40" />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showMenu && classroomsClicked ? (
          <div className="px-20 w-full h-full">
            <h1 className="text-center text-2xl text-discordBlue my-4 mb-8">Classes</h1>
            <div className="my-5 text-xl text-center text-discordBlue border-discordBlue outline-discordBlue">
              <select onChange={(e) => setSemesterSelect(e.target.value)}>
                <option value="2">Semester 2</option>
                <option value="4">Semester 4</option>
                <option value="6">Semester 6</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
            <div className="flex w-full justify-center space-x-5 flex-wrap">
              <div className="text-8xl text-center text-discordBlue">+</div>
              <h1 className="text-2xl text-discordBlue">Add Classroom</h1>
            </div>
          </div>
        ) : null}

        {showMenu && teachersClicked ? <h1>profile</h1> : null}

        {showMenu && studentsClicked ? <h1>calendar</h1> : null}

        {showMenu && settingClicked ? <h1>setting</h1> : null}
      </div>
    </>
  );
};

export default AdminDashboard;
