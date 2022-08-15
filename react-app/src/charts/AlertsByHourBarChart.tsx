import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ActivityRow } from "../Home";
import Title from "../utils/Title";

const AlertsByHourBarChart = (data: ActivityRow[]) => {

    const rows = Object.values(data);

    let hours: String[] = [...Array(24).keys()].map(i => i.toString());

    let res = [
        { name: '0', Activity: 0 },
        { name: '1', Activity: 0 },
        { name: '2', Activity: 0 },
        { name: '3', Activity: 0 },
        { name: '4', Activity: 0 },
        { name: '5', Activity: 0 },
        { name: '6', Activity: 0 },
        { name: '7', Activity: 0 },
        { name: '8', Activity: 0 },
        { name: '9', Activity: 0 },
        { name: '10', Activity: 0 },
        { name: '11', Activity: 0 },
        { name: '12', Activity: 0 },
        { name: '13', Activity: 0 },
        { name: '14', Activity: 0 },
        { name: '15', Activity: 0 },
        { name: '16', Activity: 0 },
        { name: '17', Activity: 0 },
        { name: '18', Activity: 0 },
        { name: '19', Activity: 0 },
        { name: '20', Activity: 0 },
        { name: '21', Activity: 0 },
        { name: '22', Activity: 0 },
        { name: '23', Activity: 0 },
    ];
    let temp_count = new Array(24).fill(0);

    for (const row of rows) {
        let hour: String = Intl.DateTimeFormat('en-GB', { hour: '2-digit' }).format(row.time * 1);
        temp_count[Number(hour)]++;
    }

    for (const i in temp_count) {
        res[i].Activity = temp_count[i];
    }
    
    // console.log(res);

    return (
        <>
            <Title>Activity By Hour</Title>
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


export default AlertsByHourBarChart;