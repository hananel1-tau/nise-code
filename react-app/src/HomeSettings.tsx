import { Container, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import CaregiverProfileDetails from "./CaregiverProfileDetails"
import TenantProfileDetails from "./TenantProfileDetails";
import { useAuth0 } from "@auth0/auth0-react";

const HomeSettings = () => {
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    return (
        isAuthenticated ?
            <>
                <h2>Home Account</h2>
                <Container>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Paper elevation={10}>
                                <CaregiverProfileDetails />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={10}>
                                <TenantProfileDetails />
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


export default HomeSettings;