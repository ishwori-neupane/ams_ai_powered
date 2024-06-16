import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Avatar } from "@mui/material";

const Students = (props) => {
  let rows = [
    {
      // sn: 1,
      // name: "Suman Kc",
      img: "../../../assets/Images/userprofile.jpg",
      sem: "6",
      roll: 191650,
      email: props.studentEmail,
      Attendance : props.attendance
    },
    // {
    //   sn: 2,
    //   name: "Arun Bikram Khatri",
    //   img: "../../../assets/Images/userprofile.jpg",
    //   sem: "6",
    //   roll: 191610,
    //   email: "suman.191650@ncit.edu.np",
    // },
    // {
    //   sn: 3,
    //   name: "Rikesh Silwal Khatri",
    //   img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
    //   sem: "4",
    //   roll: 191634,
    //   email: "rikesh.191634@ncit.edu.np",
    // },
    
  ];
  if(props.absent) rows = [{
    sn: 1,
    name: "Arun Bikram Khatri",
    img: "../../../assets/Images/userprofile.jpg",
    sem: "6",
    roll: 191610,
    email: "suman.191650@ncit.edu.np",
    Attendance : "Absent"
  },
  {
    sn: 2,
    name: "Rikesh Silwal Khatri",
    img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
    sem: "4",
    roll: 191634,
    email: "rikesh.191634@ncit.edu.np",
    Attendance : "Absent"
  },]
  return (
    <TableContainer component={Paper} className="table border-x-2 border-b-2 border-discordBlue dark:bg-gray-200">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* <TableCell className="tableCell">S.N.</TableCell> */}
            {/* <TableCell className="tableCell">Name</TableCell> */}
            <TableCell className="tableCell">Avatar</TableCell>
            <TableCell className="tableCell">Semester</TableCell>
            <TableCell className="tableCell">Roll</TableCell>
            <TableCell className="tableCell">Email</TableCell>
            <TableCell className="tableCell">Attendance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.sn}>
              {/* <TableCell className="tableCell">{row.sn}</TableCell> */}
              {/* <TableCell className="tableCell">{row.name}</TableCell> */}
              <TableCell className="tableCell">
                <Avatar src={row.img} />
              </TableCell>
              <TableCell className="tableCell">{row.sem}</TableCell>
              <TableCell className="tableCell">{row.roll}</TableCell>
              <TableCell className="tableCell">{row.email}</TableCell>
              <TableCell className="tableCell">{row.Attendance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Students;

