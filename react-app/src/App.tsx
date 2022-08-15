import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route, Link } from "react-router-dom";
import Settings from './Settings';
import HomeSettings from './HomeSettings';
import DeviceSettings from './DeviceSettings';
import Monitoring from './Monitoring';
import Home from './Home';
import Alerts from './Alerts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const drawerWidth = 240;


const App = () => {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  const queryClient = new QueryClient();

  // if (isLoading) return <>Loading...</>;

  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <img src="images/NISE logo 1.png" height={40} width={40} />
            <Typography>&nbsp;&nbsp;&nbsp;</Typography>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              NISE Monitoring - Non-intrusive Smart Elderly Monitoring
            </Typography>
            {isAuthenticated ?
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography>{user!.name}</Typography>
                <Typography>&nbsp;&nbsp;&nbsp;</Typography>
                <Avatar src={user!.picture} alt={user!.name} />
                <Typography>&nbsp;&nbsp;&nbsp;</Typography>
                <Button onClick={() => logout({ returnTo: window.location.origin })} variant="contained" sx={{ backgroundColor: "DeepSkyBlue" }}>Logout</Button>
              </Box>
              :
              <Button onClick={loginWithRedirect} variant="contained" sx={{ backgroundColor: "DeepSkyBlue" }}>Login</Button>
            }
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {[
                { path: "", text: "Home", icon: <InboxIcon /> },
                // { path: "settings", text: "User Settings", icon: <InboxIcon /> },
                { path: "homeSettings", text: "Home Settings", icon: <InboxIcon /> },
                { path: "deviceSettings", text: "Device Settings", icon: <InboxIcon /> },
                { path: "monitoring", text: "Monitoring", icon: <InboxIcon /> },
                { path: "alerts", text: "Alerts", icon: <InboxIcon /> },
              ].map(({ path, text, icon }, index) => (
                <ListItem key={text} disablePadding component={Link} to={"/" + path}>
                  <ListItemButton>
                    <ListItemIcon> {icon} </ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ color: 'black' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/homeSettings" element={<HomeSettings />} />
            <Route path="/deviceSettings" element={<DeviceSettings />} />
            <Route path="/deviceSettings/:state" element={<DeviceSettings />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </Box>
      </Box>
    </QueryClientProvider>
  );
}



export default App;
