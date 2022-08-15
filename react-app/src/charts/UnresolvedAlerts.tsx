import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from '../utils/Title'


const UnresolvedAlertsNumber = () => {

    return (
        <>
            <Title>Unresolved Alerts</Title>
            <Typography component="p" variant="h4" color="green">
                0
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                From {0} devices
            </Typography>
        </>
    );

}

export default UnresolvedAlertsNumber;