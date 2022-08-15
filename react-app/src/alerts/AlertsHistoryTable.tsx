import React, { useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from "../utils/Title";
import { Button, Checkbox, TableContainer } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BeenhereIcon from '@mui/icons-material/Beenhere';


const AlertsHistoryTable = () => {


    const [selectedAlertIds, setSelectedAlertIds] = useState<string[]>([]);

    const { isLoading, error, data, isFetching } = useQuery<AlertHistoryRow[], Error>(["AlertHistoryRows"], () =>
        axios
            .get("https://functionapps20220731210513.azurewebsites.net/api/alertsEvents")
            .then((res) => res.data)
    );

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isFetching) {
        return <div>Fetching...</div>
    }

    if (error) {
        return <div>Error! {error.message}</div>
    }

    if (data && data.length == 0) {
        return <div>Error! No data was fetched</div>
    }

    // console.log(data);

    const rows = Object.values(data!);

    const handleSelectAll = (event: any) => {
        let newSelectedAlertIds;

        if (event.target.checked) {
            newSelectedAlertIds = rows.map((row: any) => row.AlertId);
        } else {
            newSelectedAlertIds = [];
        }

        setSelectedAlertIds(newSelectedAlertIds);
    };

    const handleSelectOne = (event: any, AlertId: any) => {
        const selectedIndex: any = selectedAlertIds.indexOf(AlertId);
        let newSelectedAlertIds: any = [];

        if (selectedIndex === -1) {
            newSelectedAlertIds = newSelectedAlertIds.concat(selectedAlertIds, AlertId);
        } else if (selectedIndex === 0) {
            newSelectedAlertIds = newSelectedAlertIds.concat(selectedAlertIds.slice(1));
        } else if (selectedIndex === selectedAlertIds.length - 1) {
            newSelectedAlertIds = newSelectedAlertIds.concat(selectedAlertIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedAlertIds = newSelectedAlertIds.concat(
                selectedAlertIds.slice(0, selectedIndex),
                selectedAlertIds.slice(selectedIndex + 1)
            );
        }

        setSelectedAlertIds(newSelectedAlertIds);
    };

    return (
        <>
            <Title>Alerts History</Title>
            <TableContainer sx={{ m: 10 }}>
            <Button
                size="small"
                color="secondary"
                variant="contained"
                // onClick={handleCreateNewDevice}
            >
                <BeenhereIcon sx={{m:1}}/> 
                Resolve Selected Alert Events
            </Button>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAlertIds.length === rows.length}
                                    color="primary"
                                    indeterminate={selectedAlertIds.length > 0
                                        && selectedAlertIds.length < rows.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Alert ID</TableCell>
                            <TableCell>Event Message</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>Resolve Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow hover key={row.ETag} selected={false}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedAlertIds.indexOf(row.AlertId) !== -1}
                                        onChange={(event: any) => handleSelectOne(event, row.AlertId)}
                                        value="true"
                                    />
                                </TableCell>
                                <TableCell>{row.AlertId}</TableCell>
                                <TableCell>{row.EventMessage}</TableCell>
                                <TableCell>{row.StartTime}</TableCell>
                                <TableCell>{row.ResolveTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}


export interface AlertHistoryRow {
    AlertId: string,
    EventMessage: string,
    StartTime: string,
    ResolveTime: string,
    PartitionKey: string,
    RowKey: string,
    Timestamp: string,
    ETag: string,
}


export default AlertsHistoryTable;