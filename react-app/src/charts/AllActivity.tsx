import React from "react";
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from "../utils/Title";
import { TableContainer } from "@mui/material";
import { toTime, toDate } from "../utils/Time"
import { ActivityRow } from "../Home";


// Generate Order Data
// const createData = (id: number, date: string, time: string, deviceName: string, alertTriggered: string) => {
//     return { id, date, time, deviceName, alertTriggered };
// }

// const rows = [
//     createData(
//         0,
//         '16 Mar, 2019',
//         '13:02',
//         'Bedroom',
//         'No',
//     ),
//     createData(
//         1,
//         '16 Mar, 2019',
//         '12:52',
//         'Bedroom',
//         'No',
//     ),
//     createData(
//         2,
//         '16 Mar, 2019',
//         '12:28',
//         'Bathroom',
//         'No',
//     ),
//     createData(
//         3,
//         '15 Mar, 2019',
//         '11:40',
//         'Kitchen',
//         'No',
//     ),
//     createData(
//         4,
//         '15 Mar, 2019',
//         '11:03',
//         'Bedroom',
//         'No',
//     ),
//     createData(
//         5,
//         '15 Mar, 2019',
//         '11:02',
//         'Bedroom',
//         'No',
//     ),
//     createData(
//         6,
//         '15 Mar, 2019',
//         '11:02',
//         'Bedroom',
//         'No',
//     ),
//     createData(
//         7,
//         '15 Mar, 2019',
//         '11:02',
//         'Bedroom',
//         'No',
//     ),
//     createData(
//         8,
//         '15 Mar, 2019',
//         '11:02',
//         'Bedroom',
//         'No',
//     ),
// ];

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}


const AllActivity = (data: Array<ActivityRow>) => {
    

    const rows = Object.values(data).filter((row) => row.value == 1);

    rows.sort((a,b) => a.time - b.time);

    rows.reverse();

    // console.log("rows in AllActivity: ", rows);

    return (
        <>
            <Title>All Device Activities</Title>
            <TableContainer style={{ maxHeight: 1500 }}>
                <Table size="medium" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Device ID</TableCell>
                            <TableCell>Device Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.time + row.value}>
                                <TableCell>{row.DeviceId}</TableCell>
                                <TableCell>{row.DeviceName}</TableCell>
                                <TableCell>{toDate(row.time)}</TableCell>
                                <TableCell>{toTime(row.time)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );

}


export default AllActivity;