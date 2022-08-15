import React from "react";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ActivityRow } from "../Home";
import Title from "../utils/Title";


const ddd = [
    { name: 'Sunday', Activity: 30 },
    { name: 'Monday', Activity: 32 },
    { name: 'Tuesday', Activity: 50 },
    { name: 'Wednesday', Activity: 45 },
    { name: 'Thursday', Activity: 37 },
    { name: 'Friday', Activity: 27 },
    { name: 'Saturday', Activity: 23 }
];



const AlertsByWeekDayBarChart = (data: ActivityRow[]) => {

    const rows = Object.values(data);

    // console.log("rows in AlertsByWeekDayBarChart: ", rows);

    let days: String[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; 
    let res = [
        { name: 'Sunday', Activity: 0 },
        { name: 'Monday', Activity: 0 },
        { name: 'Tuesday', Activity: 0 },
        { name: 'Wednesday', Activity: 0 },
        { name: 'Thursday', Activity: 0 },
        { name: 'Friday', Activity: 0 },
        { name: 'Saturday', Activity: 0 }
    ];
    let temp_count = [0, 0, 0, 0, 0, 0, 0];

    for (const row of rows) {
        let dayNum: number = new Date(row.time * 1).getDay();
        temp_count[dayNum]++;
    }

    for (const i in temp_count) {
        res[i].Activity = temp_count[i];
    }
    
    // console.log("res in AlertsByWeekDayBarChart: ", res);

    return (
        <>
            <Title>Activity By Weekday</Title>
            <BarChart width={1000} height={300} data={res}>
                <XAxis dataKey="name" stroke="black" />
                <YAxis />
                <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
                <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Bar dataKey="Activity" fill="#38a3d1" barSize={30} />
            </BarChart>
        </>
    )
}


export default AlertsByWeekDayBarChart;