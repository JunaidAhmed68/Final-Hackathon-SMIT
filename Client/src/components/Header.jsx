import React, { useContext, useState } from 'react';
import { Link, Navigate, NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import ConfirmationModal from './confirmModal';
import Button from '@mui/material/Button';


const navLinks = [
  { title: 'Dashboard', path: '/' },
  { title: 'Upload Report', path: '/upload-report' },
  { title: 'Add Vitals', path: '/add-vitals' },
  { title: 'Timeline', path: '/timeline' },
];

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [avatarDrawerOpen, setAvatarDrawerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const toggleAvatarDrawer = (open) => () => setAvatarDrawerOpen(open);

  const handleLogout = async () => {
    try {
      logout();
      setAvatarDrawerOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton component={NavLink} to={item.path} style={({ isActive }) => ({ color: isActive ? '#1976d2' : 'inherit' })}>
              {item.title}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white' }}>HealthMate</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Avatar onClick={toggleAvatarDrawer(true)} sx={{ cursor: 'pointer' }} />
              {isMobile && <IconButton color="inherit" onClick={toggleDrawer(true)}><MenuIcon /></IconButton>}
            </>
          ) : (
            <NavLink to="/login"><Button variant="contained" color="inherit">Login</Button></NavLink>
          )}
        </Box>
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>{drawer}</Drawer>
      <Drawer anchor="right" open={avatarDrawerOpen} onClose={toggleAvatarDrawer(false)}>
        <Box sx={{ width: 250, p: 2, textAlign: 'center' }}>
          <Avatar sx={{ m: 'auto', mb: 2 }} />
          <Typography>{user?.username}</Typography>
          <Typography color="textSecondary">{user?.email}</Typography>
          <Button onClick={() => setShowModal(true)} variant="contained" color="error" sx={{ mt: 2 }}>Logout</Button>
        </Box>
      </Drawer>
      <ConfirmationModal open={showModal} onClose={() => setShowModal(false)} onConfirm={handleLogout} message="Are you sure you want to logout?" />
    </AppBar>
  );
};

export default Header;