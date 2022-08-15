import React, { useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, Modal, Paper, TextField } from "@mui/material";
import DeviceList from "./DeviceList"
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { ActivityRow } from "./Home";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { userID } from "./Home";


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const DeviceSettings = () => {

    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    let { state: device_id } = useParams();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [newDeviceValues, setNewDeviceValues] = useState({
        deviceId: device_id ? device_id : '',
        deviceName: '',
        deviceLocation: '',
        userId: userID,
    });

    const handleNewDeviceChange = (event: any) => {
        setNewDeviceValues({
            ...newDeviceValues,
            [event.target.name]: event.target.value
        });
    };


    const handleCreateNewDevice = async (event: any) => {
        const { data: response } = await axios.post(
            "https://functionapps20220731210513.azurewebsites.net/api/Device?UserId=" + newDeviceValues.userId +
            "&DeviceId=" + newDeviceValues.deviceId + "&DeviceLocation=" + newDeviceValues.deviceLocation + "&DeviceName=" + newDeviceValues.deviceName, {});
    }

    const { isLoading, error, data, isFetching } = useQuery<ActivityRow[], Error>(["userDevices"], () =>
        axios
            .get("https://functionapps20220731210513.azurewebsites.net/api/Device?UserId=" + userID)
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

    if (data.length == 0) {
        return <div>Error! No data was fetched</div>
    }

    return (
        isAuthenticated ?
            <>
                <h2>Device Settings</h2>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleOpen}
                >
                    <AddIcon />
                    Add Device
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <form autoComplete="off" noValidate>
                            <Card>
                                <CardHeader title="Add New Device" />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Device ID"
                                                name="deviceId"
                                                required
                                                variant="outlined"
                                                onChange={handleNewDeviceChange}
                                                value={newDeviceValues.deviceId}
                                            />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Device Name"
                                                name="deviceName"
                                                required
                                                variant="outlined"
                                                onChange={handleNewDeviceChange}
                                            />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Device Location"
                                                name="deviceLocation"
                                                required
                                                variant="outlined"
                                                onChange={handleNewDeviceChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Divider />
                            </Card>
                        </form>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleCreateNewDevice}
                        >
                            <SendIcon />
                            Create New Device
                        </Button>
                    </Box>
                </Modal>
                <Container>
                    <Grid container spacing={1}>

                        <Grid item xs={12}>
                            <Paper elevation={10}>
                                <DeviceList devices={data} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </> :
            <>
                Hello! Please login to start using our system.
            </>
    );
}


export default DeviceSettings;