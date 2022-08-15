import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import PieChartMain from "./charts/PieChartMain";
import { Container, Grid, Paper, Typography } from "@mui/material";
import RecentActivities from "./charts/RecentActivities";
import LastActivity from "./charts/LastActivity";
import AlertsNumber from "./charts/AlertsNumber";
import UnresolvedAlertsNumber from "./charts/UnresolvedAlerts";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";

export const userID = "Tomer Hananel";

const Home = () => {
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const elevation = 8;

    const { isLoading, error, data, isFetching } = useQuery<ActivityRow[], Error>(["ActivityRows"], () =>
        axios
            .get("https://functionapps20220731210513.azurewebsites.net/api/GetUserTelemetryData?UserId=" + userID)
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
                <Typography component="h1" variant="h4" color="black" gutterBottom>
                    Hello {user!.name}!
                </Typography>
                <Container>
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                        <Grid item xs={4}>
                            <Paper elevation={elevation} sx={{ height: "100%", alignItems: "center", textAlign: 'center', p: 1 }}>
                                <LastActivity {...data} />
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper elevation={elevation} sx={{ height: "100%", alignItems: "center", textAlign: 'center', p: 1 }}>
                                <AlertsNumber />
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper elevation={elevation} sx={{ height: "100%", alignItems: "center", textAlign: 'center', p: 1 }}>
                                <UnresolvedAlertsNumber />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={elevation} sx={{ height: "100%", alignItems: "center", textAlign: 'center', p: 1 }}>
                                <RecentActivities {...data} />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={elevation} sx={{ height: "100%", alignItems: "center", textAlign: 'center', p: 1 }}>
                                <PieChartMain {...data} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </>
            :
            <>
                Hello! Please login to start using our system.
            </>
    );
}

export interface ActivityRow {
    DeviceId: string,
    DeviceName: string,
    Location: string,
    PirId: number,
    UserId: string,
    time: number,
    value: number,
}


export default Home;