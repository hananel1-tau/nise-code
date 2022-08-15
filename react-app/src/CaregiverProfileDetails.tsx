import { useState } from "react";
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField } from '@mui/material';


const CaregiverProfileDetails = (props: any) => {

    const [values, setValues] = useState({
        firstName: 'Katarina',
        lastName: 'Smith',
        email: 'demo@devias.io',
        phone: '530-337-7957',
    });

    const handleChange = (event: any) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    return (
        <form autoComplete="off" noValidate {...props}>
            <Card>
                <CardHeader title="Caregiver Profile" />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>

                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="First name"
                                name="firstName"
                                onChange={handleChange}
                                required
                                value={values.firstName}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Last name"
                                name="lastName"
                                onChange={handleChange}
                                required
                                value={values.lastName}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                onChange={handleChange}
                                required
                                value={values.email}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                helperText="Phone number for alerts"
                                name="phone"
                                required
                                onChange={handleChange}
                                value={values.phone}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                    <Button color="primary" variant="contained">
                        Save Details
                    </Button>
                </Box>
            </Card>
        </form>
    )
}


export default CaregiverProfileDetails;