import { Box, Container, Grid, Paper, Tab, Tabs } from "@mui/material";
import Chart01 from "./charts/Chart01";
import React from "react";
import AlertsByWeekDayBarChart from "./charts/AlertsByWeekDayBarChart";
import AllActivity from "./charts/AllActivity";
import AlertsByHourBarChart from "./charts/AlertsByHourBarChart";
import AlertsByTimeChart from "./charts/AlertsByTimeChart";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ActivityRow } from './Home'
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { userID } from "./Home";


const Monitoring = () => {

    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    
    const [tabValue, setTabValue] = React.useState('home');

    const elevation = 2;

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const { isLoading, error, data, isFetching } = useQuery<ActivityRow[], Error>(["ActivityRows"], () =>
        axios
            .get("https://functionapps20220731210513.azurewebsites.net/api/GetUserTelemetryData?UserId=" + userID)
            .then((res) => res.data)
    );

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error! {error.message}</div>
    }

    return (
        isAuthenticated ?
            <>
                <h2>Monitoring - {tabValue == "home" ? "Home Overview" : "Devices"}</h2>
                <Box sx={{ width: '100%' }} >
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        <Tab value="home" label="Home Overview" />
                        <Tab value="devices" label="Devices" />
                    </Tabs>
                </Box>
                <Box>
                    {
                        tabValue == "home" ?
                            <Container>
                                <Grid
                                    container spacing={3}
                                // justifyContent="center"
                                // alignItems="center"
                                >
                                    <Paper
                                        elevation={elevation}
                                        sx={{
                                            height: "100%",
                                            alignItems: "center",
                                            textAlign: 'center',
                                            p: 1
                                        }}
                                    >
                                        <Grid item xs={12}>
                                            <AlertsByWeekDayBarChart {...data} />
                                        </Grid>
                                    </ Paper>
                                    <Paper
                                        elevation={elevation}
                                        sx={{
                                            height: "100%",
                                            alignItems: "center",
                                            textAlign: 'center',
                                            p: 1
                                        }}
                                    >
                                        <Grid item xs={12}>
                                            <AlertsByHourBarChart {...data} />
                                        </Grid>
                                    </ Paper>
                                </Grid>
                            </Container>
                            // Else: Tab is Devices:
                            :
                            <Container>
                                <Grid container >
                                    <Paper
                                        elevation={elevation}
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            alignItems: "center",
                                            textAlign: 'center',
                                            p: 1
                                        }}
                                    >
                                        <Grid item xs={12}>
                                            <AlertsByTimeChart {...data} />
                                        </Grid>
                                    </Paper>
                                    <Paper
                                        elevation={elevation}
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            alignItems: "center",
                                            textAlign: 'center',
                                            p: 1
                                        }}
                                    >
                                        <Grid item xs={12}>
                                            <AllActivity {...data} />
                                        </Grid>
                                    </Paper>
                                </Grid>

                            </Container>
                    }
                </Box>
            </ > :
            <>
                Hello! Please login to start using our system.
            </>
    );
}


export default Monitoring;