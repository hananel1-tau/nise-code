import { v4 as uuid } from 'uuid';

export const devices = [
  {
    id: uuid(),
    last_activity: 1555016400000,
    device_name: 'Main Bedroom Door',
    location: 'bedroom',
    device_id: '0',
    status: 'On'
  },
  {
    id: uuid(),
    last_activity: 1555016400000,
    device_name: 'Second Bedroom Door',
    location: 'room',
    device_id: '1',
    status: 'Off'
  },
  {
    id: uuid(),
    last_activity: 1555016400000,
    device_name: 'Kitchen Entrance',
    location: 'kitchen',
    device_id: '2',
    status: 'On'
  },
  {
    id: uuid(),
    last_activity: 1554930000000,
    device_name: 'Bathroom Entrance',
    location: 'bathroom',
    device_id: '3',
    status: 'On'
  },
];
