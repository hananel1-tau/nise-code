import { v4 as uuid } from 'uuid';

export const alerts = [
    {
        id: uuid(),
        alert_name: "Bathroom Alert",
        alert_description: "Alert when no activity from Bathroom for more than 10 hours",
        alert_type: "Device Specific",
        alert_device: "Bathroom",
        alert_hours_thresold: 10, 
        alert_status: "On",
        creation_date: 1555016400000,
    },
    {
        id: uuid(),
        alert_name: "Bedroom Alert",
        alert_description: "Alert when no activity from Bedroom for more than 18 hours",
        alert_type: "Device Specific",
        alert_device: "Main Bedroom",
        alert_hours_thresold: 18, 
        alert_status: "On",
        creation_date: 1555016400000,
    },
    {
        id: uuid(),
        alert_name: "Kitchen Alert",
        alert_description: "Alert when no activity from Kitchen for more than 14 hours",
        alert_type: "Device Specific",
        alert_device: "Kitchen",
        alert_hours_thresold: 14, 
        alert_status: "On",
        creation_date: 1555016400000,
    },
    {
        id: uuid(),
        alert_name: "General Alert",
        alert_description: "Alert when no activity from all devices for 8 hours",
        alert_type: "General",
        alert_device: null,
        alert_hours_thresold: 8, 
        alert_status: "On",
        creation_date: 1555016400000,
    }
];