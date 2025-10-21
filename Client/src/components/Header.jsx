import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Container,
  Badge,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Upload,
  Favorite,
  Timeline,
  Logout,
  Person,
  Settings,
  MedicalInformation,
  Notifications,
  ArrowDropDown,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import ConfirmationModal from './confirmModal';
import HealthMateLogo from './HealthMateLogo.jsx';

// Custom theme colors
const theme = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#10b981',
  background: '#f8fafc'
};

const navLinks = [
  { title: 'Dashboard', path: '/', icon: <Dashboard /> },
  { title: 'Upload Report', path: '/upload-report', icon: <Upload /> },
  { title: 'Add Vitals', path: '/add-vitals', icon: <Favorite /> },
  { title: 'Timeline', path: '/timeline', icon: <Timeline /> },
];

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const toggleMobileDrawer = (open) => () => setMobileDrawerOpen(open);

  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const handleLogout = async () => {
    try {
      logout();
      handleUserMenuClose();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileDrawerOpen(false);
    handleUserMenuClose();
  };

  // Mobile Drawer Content
  const mobileDrawer = (
    <Box sx={{ width: 280 }} role="presentation">
      {/* Header in Drawer */}
      <Box sx={{ p: 2, background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HealthMateLogo size={32} />
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
            HealthMate
          </Typography>
        </Box>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 40, height: 40, mr: 1 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.username}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Navigation Links */}
      <List sx={{ pt: 1 }}>
        {navLinks.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                  '& .MuiListItemIcon-root': {
                    color: theme.primary,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button in Drawer */}
      {user && (
        <Box sx={{ p: 2, position: 'absolute', bottom: 0, width: '100%' }}>
          <Divider sx={{ mb: 2 }} />
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={() => setShowLogoutModal(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={2}
      sx={{ 
        background: 'white',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.primary}20`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <HealthMateLogo size={32} />
              <Typography
                variant="h5"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                HealthMate
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {user && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
                {navLinks.map((item) => (
                  <Button
                    key={item.title}
                    onClick={() => handleNavigation(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: 'text.primary',
                      textTransform: 'none',
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: `${theme.primary}08`,
                        color: theme.primary,
                      },
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          {/* Right Side - User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                {/* Notifications (Optional) */}
                <IconButton sx={{ color: 'text.secondary' }}>
                  <Badge badgeContent={0} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>

                {/* User Avatar & Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      cursor: 'pointer',
                      border: `2px solid ${theme.primary}20`,
                    }}
                    onClick={handleUserMenuOpen}
                  />
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1 }}>
                      {user?.username}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
                      {user?.email}
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={handleUserMenuOpen}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ArrowDropDown />
                  </IconButton>
                </Box>

                {/* Mobile Menu Button */}
                <IconButton
                  color="inherit"
                  onClick={toggleMobileDrawer(true)}
                  sx={{ display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>

                {/* User Menu Dropdown */}
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleUserMenuClose}>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleUserMenuClose}>
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={() => {
                      handleUserMenuClose();
                      setShowLogoutModal(true);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <ListItemIcon><Logout fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              /* Login/Signup Buttons for non-authenticated users */
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    boxShadow: `0 2px 8px ${theme.primary}30`,
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer(false)}
        ModalProps={{ keepMounted: true }}
      >
        {mobileDrawer}
      </Drawer>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from HealthMate?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </AppBar>
  );
};

export default Header;