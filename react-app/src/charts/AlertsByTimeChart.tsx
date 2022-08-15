import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ActivityRow } from "../Home";
import Title from "../utils/Title";
import { userID } from "../Home";

const getDateFromString = (st: string) => {
    const d = st.split("/");
    return new Date(Number(d[2]), Number(d[1]) - 1, Number(d[0]));
}

const roundToNearestHour = (ts: any) => {
    return Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit' }).format(ts * 1);
}

const filterDataByDeviceAndPrepareForGraph = (data: ActivityRow[], device: string) => { 
    let rows: any[] = Object.values(data).filter((row) => row.value === 1);

    if (device != "All") {
        rows = rows.filter((row: ActivityRow) => row.DeviceName === device);
    }

    rows.forEach(function (row: any) {
        row.hourBin = roundToNearestHour(row.time);
    });


    const groupByKey = (list: any, key: any, {omitKey=false}) => list.reduce((hash: any, {[key]:value, ...rest}) => ({...hash, [value]:( hash[value] || [] ).concat(omitKey ? {...rest} : {[key]:value, ...rest})} ), {});


    const RowsGroupedByHourBin = groupByKey(rows, "hourBin", {omitKey:false});


    const result = [];
    for (const key of Object.keys(RowsGroupedByHourBin)) {
       result.push({ name: key, Activity: RowsGroupedByHourBin[key].length});
    }

    const final_result = [];

    const first_bin = result[0];
    let first_bin_date = first_bin.name.split(" ")[0].slice(0, -1);
    let first_bin_hour = Number(first_bin.name.split(" ")[1]);
    let first_bin_date_format = getDateFromString(first_bin_date);

    const last_bin = result[result.length - 1];
    let last_bin_date = last_bin.name.split(" ")[0].slice(0, -1);
    let last_bin_hour = Number(last_bin.name.split(" ")[1]);
    let last_bin_date_format = getDateFromString(last_bin_date);

    var loop = new Date(first_bin_date_format);

    while (loop <= last_bin_date_format) {
        var i = 0;
        while (i < 24) {
            const final_month = Number((loop.getMonth() + 1)) >= 10 ? (loop.getMonth() + 1) : "0" + (loop.getMonth() + 1);
            final_result.push({ name: loop.getDate() + "/" + final_month + "/" + loop.getFullYear() + ", " + i, Activity: 0});
            i++;
        }
        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
    }

    
    for (const row of result) {
        for (const final_row of final_result) {
            if (row.name === final_row.name) {
                final_row.Activity = row.Activity;
            }
        }
    }
    
    return final_result;
}


const AlertsByTimeChart = (data: Array<ActivityRow>) => {

    const { isLoading, error, data: deviceData, isFetching } = useQuery<ActivityRow[], Error>(["userDevices"], () =>
        axios
            .get("https://functionapps20220731210513.azurewebsites.net/api/Device?UserId=" + userID)
            .then((res) => res.data)
    );

    const [device, setDevice] = React.useState('All');
    const handleChange = (event: SelectChangeEvent) => {
        setDevice(event.target.value as string);
    };
    const final_result = filterDataByDeviceAndPrepareForGraph(data, device);

    return (
        <>
            <Title>Activity Timeline</Title>
            <FormControl sx={{ width: 180 }}>
                <InputLabel>Device</InputLabel>
                <Select
                    value={device}
                    label="Device"
                    onChange={handleChange}
                >
                    <MenuItem value={"All"}>All Devices</MenuItem>
                    {
                        deviceData?.map((device) => <MenuItem key={device.DeviceId} value={device.DeviceName}>{device.DeviceName}</MenuItem>)
                    }
                </Select>
            </FormControl>
            <BarChart width={900} height={400} data={final_result}>
                <XAxis dataKey="name" stroke="black" angle={90} interval={0} hide={true} />
                <YAxis dataKey="Activity" type="number" hide={true}/>
                <Tooltip wrapperStyle={{ width: 150, backgroundColor: '#ccc' }} />
                <Legend width={100} wrapperStyle={{ top: 15, right: 15, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Bar dataKey="Activity" fill="#38a3d1" barSize={30} />
            </BarChart>
        </>
    )
}


export default AlertsByTimeChart;