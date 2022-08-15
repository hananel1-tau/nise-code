import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './../utils/Title'
import { ActivityRow } from '../Home'
import { toTime, toDate } from "../utils/Time"


const LastActivity = (data : Array<ActivityRow>) => {

    const dataLength = Object.keys(data).length;
    
    return (
        <>
            <Title>Last Activity</Title>
            <Typography component="p" variant="h4" color="green">
                {toTime(data[dataLength - 1].time)}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                on {toDate(data[dataLength - 1].time)}
            </Typography>
        </>
    );

}

export default LastActivity;