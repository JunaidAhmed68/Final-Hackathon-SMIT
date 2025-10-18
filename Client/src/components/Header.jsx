import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../context/AuthContext";
import ConfirmationModal from "./confirmModal";


let navLinks = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  // { title: "Contact", path: "/contact" },
  // { title: "Products", path: "/products" },
  // { title: "Sell on app", path: "/sell-on-app" },
];

// axios.defaults.withCredentials = true; // ✅ Send cookies

const Header = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [avatarDrawerOpen, setAvatarDrawerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const toggleAvatarDrawer = (open) => () => {
    setAvatarDrawerOpen(open);
  };

  const handleLogout = async () => {
    try {
      logout();
      setAvatarDrawerOpen(false); // Close the avatar drawer
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };



  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/auth/me", {
  //         withCredentials: true, // Important to include cookies
  //       });
  //       setUser (response.data);
  //     } catch (err) {
  //       console.error(err);
  //       setError(err.response?.data?.message || "Failed to fetch user data");
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  const drawer = (
    <Box
      sx={{ width: 550 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              {item.title}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      {/* Outer Toolbar (full width) */}
      <Toolbar disableGutters>
        {/* Inner container to center content on large screens */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "1200px", // Adjust this value as needed
            margin: "0 auto", // Centers the content
            paddingX: 2, // Adds horizontal padding on small screens
          }}
        >
          {/* Logo - left */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Typography variant="h6" sx={{ color: "orange" }}>
              My App
            </Typography>
          </Box>

          {/* Links - center */}
          {!isMobile && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="ul"
                sx={{
                  display: "flex",
                  listStyle: "none",
                  gap: 2,
                  margin: 0,
                  padding: 0,
                }}
              >
                {navLinks.map((item) => (
                  <Box component="li" key={item.title}>
                    <NavLink
                      to={item.path}
                      style={({ isActive }) => ({
                        color: isActive ? "orange" : "white",
                        textDecoration: "none",
                      })}
                    >
                      {item.title}
                    </NavLink>
                  </Box>
                ))}
                <NavLink
                  to="/mycart"
                  style={({ isActive }) => ({
                    color: isActive ? "orange" : "white",
                    textDecoration: "none",
                  })}
                >
                
                </NavLink>
              </Box>
            </Box>
          )}
          {/* Avatar and mobile menu - right */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
            }}
          >
            {user ? (
              <>
                {/* Avatar shown when user is logged in */}
                <Avatar
                  alt="User"
                  src={user?.photoURL || ""}
                  sx={{ width: 36, height: 36, cursor: "pointer" }}
                  onClick={toggleAvatarDrawer(true)}
                />
              </>
            ) : (
              <NavLink to="login">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out w-full sm:w-auto active:bg-blue-800 ">
                  Login
                </button>
              </NavLink>
            )}
            {/* Show mobile menu icon only on mobile */}
            {isMobile && (
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: { xs: "75vw", sm: 400 },
            padding: 2,
            backgroundColor: "#fff",
            height: "100vh",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navLinks.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? "orange" : "transparent",
                    color: isActive ? "#fff" : "#000",
                    textDecoration: "none",
                    borderRadius: 8,
                  })}
                >
                  {item.title}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* profile drawer */}
      <Drawer
        anchor="right"
        open={avatarDrawerOpen}
        onClose={toggleAvatarDrawer(false)}
      >
        <Box
          sx={{
            width: 300,
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff",
            height: "100%",
            gap: 2,
          }}
        >
          {/* Avatar */}
          <Avatar
            alt={user?.username || "User"}
            src={user?.photoURL || ""}
            sx={{
              width: 90,
              height: 90,
              mb: 1,
              border: "3px solid #1976d2",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />

          {/* Username */}
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#111" }}>
            {user?.username || "User"}
          </Typography>

          {/* Email */}
          <Typography
            variant="body2"
            sx={{ color: "gray", wordBreak: "break-word" }}
          >
            {user?.email}
          </Typography>

          {/* Divider */}
          <Box sx={{ width: "100%", mt: 2, mb: 1 }}>
            <hr style={{ borderColor: "#e0e0e0" }} />
          </Box>          

          {/* Logout Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
          >
            Logout
          </button>

          {/* Logout Confirmation Modal */}
          <ConfirmationModal
            open={showModal}
            onClose={() => setShowModal(false)}
            message="Are you sure you want to logout? You will need to login again to access your account."
            confirmText="Logout"
            cancelText="Cancel"
            dialogTitle="Logout Confirmation"
            onConfirm={handleLogout}
            onCancel={() => setShowModal(false)}
          />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
