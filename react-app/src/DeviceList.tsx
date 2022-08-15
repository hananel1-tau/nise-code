import {
    Box, Container, Avatar, Card,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';



const DeviceList = ({ devices, ...rest }: any) => {

    const [selectedDeviceIds, setSelectedDeviceIds] = useState<number[]>([]);

    const handleSelectAll = (event: any) => {
        let newSelectedDeviceIds;

        if (event.target.checked) {
            newSelectedDeviceIds = devices.map((device: any) => device.DeviceId);
        } else {
            newSelectedDeviceIds = [];
        }

        setSelectedDeviceIds(newSelectedDeviceIds);
    };

    const handleSelectOne = (event: any, id: any) => {
        const selectedIndex: any = selectedDeviceIds.indexOf(id);
        let newSelectedDeviceIds: any = [];

        if (selectedIndex === -1) {
            newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedDeviceIds, id);
        } else if (selectedIndex === 0) {
            newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedDeviceIds.slice(1));
        } else if (selectedIndex === selectedDeviceIds.length - 1) {
            newSelectedDeviceIds = newSelectedDeviceIds.concat(selectedDeviceIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedDeviceIds = newSelectedDeviceIds.concat(
                selectedDeviceIds.slice(0, selectedIndex),
                selectedDeviceIds.slice(selectedIndex + 1)
            );
        }

        setSelectedDeviceIds(newSelectedDeviceIds);
    };

    return (
        <Container maxWidth={false}>
            <Box sx={{ mt: 3 }}>
                <Card {...rest}>
                    <PerfectScrollbar>
                        <Box sx={{ minWidth: 1050 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedDeviceIds.length === devices.length}
                                                color="primary"
                                                indeterminate={
                                                    selectedDeviceIds.length > 0
                                                    && selectedDeviceIds.length < devices.length
                                                }
                                                onChange={handleSelectAll}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            Device ID
                                        </TableCell>
                                        <TableCell>
                                            Device Name
                                        </TableCell>
                                        <TableCell>
                                            Location
                                        </TableCell>
                                        <TableCell>
                                            Status
                                        </TableCell>
                                        <TableCell>
                                            Last Activity
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {devices.map((device: any) => (
                                        <TableRow
                                            hover
                                            key={device.DeviceId}
                                            selected={selectedDeviceIds.indexOf(device.DeviceId) !== -1}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedDeviceIds.indexOf(device.DeviceId) !== -1}
                                                    onChange={(event: any) => handleSelectOne(event, device.DeviceId)}
                                                    value="true"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        alignItems: 'center',
                                                        display: 'flex'
                                                    }}
                                                >
                                                    <Typography
                                                        color="textPrimary"
                                                        variant="body1"
                                                    >
                                                        {device.DeviceId}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {device.DeviceName}
                                            </TableCell>
                                            <TableCell>
                                                {device.DeviceLocation}
                                            </TableCell>
                                            <TableCell>
                                                {"On"}
                                            </TableCell>
                                            <TableCell>
                                                {device.Timestamp}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </PerfectScrollbar>
                </Card>
            </Box>
        </Container>
    );

}

export default DeviceList;