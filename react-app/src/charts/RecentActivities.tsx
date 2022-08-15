import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from "../utils/Title";
import { ActivityRow } from "../Home";
import { toTime, toDate } from "../utils/Time"


const RecentActivities = (data: Array<ActivityRow>) => {

    const rows = Object.values(data).filter((row) => row.value == 1).slice(-6);
    rows.reverse();

    return (
        <>
            <Title>Recent Activities</Title>
            <Table size="medium">
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
        </>
    );

}


export default RecentActivities;