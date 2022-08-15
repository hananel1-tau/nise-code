import { useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, MenuItem, TextField } from '@mui/material';
import axios from "axios";

const AlertsConfiguration = (props: any) => {


    // const { data: response } = await axios.post(
        // "https://functionapps20220731210513.azurewebsites.net/api/alert?alertType=NoTelemetry" + 
        // "&alertEntityType=" + "device" + "&entityId=" + "some_device_id" + "&minutesBack=" + "300", {});

        const handleCreateNewAlert = async (event: any) => {
            // console.log(newDeviceValues);
            
            const url = "https://functionapps20220731210513.azurewebsites.net/api/alert?alertType=NoTelemetry" + 
            "&alertEntityType=" + newAlertValues.entityType + "&entityId=" + newAlertValues.entityID + "&MinutesSinceLast=" + newAlertValues.minutes_threshold;
            console.log("url: ", url);

            const { data: response } = await axios.post(
                "https://functionapps20220731210513.azurewebsites.net/api/alert?alertType=NoTelemetry" + 
                "&alertEntityType=" + newAlertValues.entityType + "&entityId=" + newAlertValues.entityID + "&MinutesSinceLast=" + newAlertValues.minutes_threshold , {});
    
            console.log(response);
        }

    const [newAlertValues, setNewAlertValues] = useState({
        type: 'NoTelemtry',
        entityType: 'device',
        entityID: "",
        minutes_threshold: 600,
    });


    const handleChange = (event: any) => {
        setNewAlertValues({
            ...newAlertValues,
            [event.target.name]: event.target.value
        });
    };

    return (
        <form autoComplete="off" noValidate {...props}>
            <Card>
                <CardHeader title="Add new Alert" />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>

                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Alert Type"
                                name="type"
                                required
                                value={newAlertValues.type}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Entity Type"
                                name="entityType"
                                helperText="Choose 'Device' for device-specific alert, 'User' otherwise"
                                onChange={handleChange}
                                value={newAlertValues.entityType}
                                variant="outlined"
                            >
                                <MenuItem key={"device"} value={"device"}>
                                    {"Device"}
                                </MenuItem>
                                <MenuItem key={"user"} value={"user"}>
                                    {"User"}
                                </MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Entity ID"
                                name="entityID"
                                helperText="If entity type is 'Device', enter device ID. Otherwise, enter User ID"
                                onChange={handleChange}
                                value={newAlertValues.entityID}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Minutes Threshold"
                                helperText="Value for threshold"
                                name="minutes_threshold"
                                type="number"
                                onChange={handleChange}
                                value={newAlertValues.minutes_threshold}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                    <Button color="primary" variant="contained" onClick={handleCreateNewAlert}>
                        Add New Alert
                    </Button>
                </Box>
            </Card>
        </form>
    )
}


export default AlertsConfiguration;