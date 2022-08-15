// import "./styles.css";
import React, { useCallback, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { ActivityRow } from "../Home";
import Title from "../utils/Title";


const dd = [
    { name: 'Bedroom', value: 16 },
    { name: 'Kitchen', value: 7 },
    { name: 'Bathroom', value: 4 },
    { name: 'Entrance', value: 1 },
];


const calcDeviceHistogram = (data: ActivityRow[]) => {
    const devices_list = data.map((row) => row.DeviceId);
    let devices = devices_list.filter(function(item, pos) {
        return devices_list.indexOf(item) == pos;
    })

    let result: any[] = [];

    for (const dev of devices) {
        result.push({name: dev, value: 0});
    }

    for (const row of data) {
        for (let item of result) {
            if (item.name == row.DeviceId) {
                item.value = item.value + 1; 
            }
        }
    }

    return result;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

const PieChartMain = (data: Array<ActivityRow>) => {

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
        payload
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize={13}
            >
                {/* {`${(percent * 100).toFixed(0)}%`} */}
                {`${payload.name} (${(percent * 100).toFixed(0)}%)`}
            </text>
        );
    };

    const rows = Object.values(data);
    const deviceHist = calcDeviceHistogram(rows);
    // console.log(deviceHist);

    const deviceHistKeys = Object.keys(deviceHist);

    return (
        <>
            <Title>Activities in Past Month</Title>
            <PieChart width={600} height={380}>
                <Pie
                    data={deviceHist}
                    cx={280}
                    cy={180}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={160}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={false}
                >
                    {deviceHistKeys.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </>
    );
}

export default PieChartMain;
