import { Box, Container, Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import AlertsConfiguration from "./alerts/AlertsConfiguration";
import AlertsHistory from "./alerts/AlertsHistory";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";

const Alerts = () => {

    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const [tabValue, setTabValue] = React.useState('history');

    const { isLoading, error, data, isFetching } = useQuery<Alert[], Error>(["AlertRows"], () =>
        axios
            .get("https://functionapps20220731210513.azurewebsites.net/api/alert")
            .then((res) => res.data)
    );

    // console.log("Data from alerts api: ", data);

    if (data && data.length === 0) {
        return <div>Error! No data was fetched</div>
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        isAuthenticated && data ?
            <>
                <h2>Alerts - {tabValue === "1" ? "History" : "Configuration"}</h2>
                <Box sx={{ width: '100%' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        <Tab value="history" label="History" />
                        <Tab value="config" label="Configuration" />
                    </Tabs>
                </Box>
                <Box>
                    {
                        tabValue === "history" ?
                            <Container>
                                <Grid
                                    container spacing={3}
                                // justifyContent="center"
                                // alignItems="center"
                                >
                                    <Grid item xs={12}>
                                        <AlertsHistory {...data}/>
                                    </Grid>
                                </Grid>
                            </Container>
                            // Else: Tab is Configuration:
                            :
                            <Container>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <AlertsConfiguration />
                                    </Grid>
                                </Grid>
                            </Container>
                    }
                </Box>
            </> :
            <>
                Hello! Please login to start using our system.
            </>
    );
}

export interface Alert {
    AlertType: string,
    AlertEntityType: string,
    EntityId: string,
    MinutesSinceLast: number,
    PartitionKey: string,
    RowKey: string,
    Timestamp: string,
    ETag: string,
}


export default Alerts;