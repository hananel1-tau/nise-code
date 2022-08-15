import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from '../utils/Title'


const AlertsNumber = () => {

    return (
        <>
            <Title>Number of Alerts</Title>
            <Typography component="p" variant="h4" color="green">
                3
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                in the past month
            </Typography>
        </>
    );

}

export default AlertsNumber;