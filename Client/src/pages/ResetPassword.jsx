import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { LoadingButton } from "@mui/lab";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/auth/reset-password/${token}`,
        { password }
      );
      toast.success(res.data.message);
      setReset(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {reset ? (
        <Card className="w-full max-w-md shadow-2xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <Box display="flex" justifyContent="center" mb={2}>
              <LockResetIcon color="success" sx={{ fontSize: 50 }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="green" gutterBottom>
              Password Reset Successful 🎉
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Your password has been changed successfully.
              <br /> You can now log in with your new password.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-2xl rounded-2xl">
          <CardContent className="p-8">
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <LockResetIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
              Reset Your Password
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              mb={3}
            >
              Enter your new password below to reset your account access.
            </Typography>

            <form onSubmit={handleReset} className="space-y-4">
              <TextField
                type="password"
                label="New Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <LoadingButton
                type="submit"
                loading={loading}
                loadingPosition="start"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                Reset Password
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResetPassword;
