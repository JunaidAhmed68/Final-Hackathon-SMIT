import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Box,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [timer, setTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(0);

  useEffect(() => {
    if (timer) {
      setTimeLeft(60); // 1 minute = 60 seconds
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setTimer(false);
            setDisableButton(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [timer]);

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email!");
    setDisableButton(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/forgot-password",
        { email }
      );
      toast.success(res.data.message);
      setTimer(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      setDisableButton(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-6 sm:p-8">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <MailOutlineIcon color="primary" sx={{ fontSize: 40 }} />
          </Box>

          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Forgot Password
          </Typography>

          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            mb={3}
          >
            Enter your registered email address to receive a password reset
            link.
          </Typography>

          <form onSubmit={handleForgot} className="space-y-4">
            <TextField
              type="email"
              label="Email Address"
              variant="outlined"
              sx={{ marginBottom: 3 }}
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={disableButton}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              size="large"
              disabled={disableButton}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                py: 1.5,
              }}
            >
              {disableButton
                ? timeLeft > 0
                  ? `Wait ${timeLeft}s`
                  : "Sending..."
                : "Send Reset Link"}
            </Button>
          </form>

          {timer && (
            <Box mt={3}>
              <LinearProgress
                variant="determinate"
                value={((60 - timeLeft) / 60) * 100}
              />
              <Typography
                variant="caption"
                display="block"
                textAlign="center"
                color="textSecondary"
                mt={1}
              >
                You can resend the link in {timeLeft} seconds
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
