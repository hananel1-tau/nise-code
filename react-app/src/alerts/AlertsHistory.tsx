import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from "../utils/Title";
import { TableContainer } from "@mui/material";
import { Alert } from "../Alerts";
import AlertsHistoryTable from "./AlertsHistoryTable";

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

const AlertsHistory = (data : Array<Alert>) => {

    const rows = Object.values(data);

    return (
        <>
            <Title>Exsiting Alerts</Title>
            <TableContainer sx={{m: 10}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Alert Type</TableCell>
                            <TableCell>Entity Type</TableCell>
                            <TableCell>Entity</TableCell>
                            <TableCell>Hours Threshold</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Creation Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.ETag}>
                                <TableCell>{row.AlertType}</TableCell>
                                <TableCell>{row.AlertEntityType}</TableCell>
                                <TableCell>{row.EntityId}</TableCell>
                                <TableCell>{row.MinutesSinceLast}</TableCell>
                                <TableCell>{"On"}</TableCell>
                                <TableCell>{row.Timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AlertsHistoryTable />
        </>
    );

}


export default AlertsHistory;