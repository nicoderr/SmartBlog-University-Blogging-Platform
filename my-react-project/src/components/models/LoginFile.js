import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import authService from "../../services/authService";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);
      setEmail("");
      setPassword("");
      onLogin(response.user.role);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || password.length < 6) {
      setError("Email and password (min 6 chars) are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.register(email, password, role);
      setEmail("");
      setPassword("");
      setError("");
      setIsRegister(false);
      onLogin(response.user.role);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (isRegister) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
        {isRegister ? "Sign Up" : "Login"}
      </Typography>

      {error && (
        <Typography color="error" sx={{ marginBottom: 2, padding: 1, backgroundColor: "#ffebee", borderRadius: 1 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        helperText={isRegister ? "Minimum 6 characters" : ""}
      />

      {isRegister && (
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Select Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Moderator">Moderator</MenuItem>
            <MenuItem value="Administrator">Administrator</MenuItem>
          </Select>
        </FormControl>
      )}

      <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : isRegister ? "Sign Up" : "Login"}
        </Button>
      </Box>

      <Button
        variant="text"
        onClick={() => {
          setIsRegister(!isRegister);
          setError("");
          setEmail("");
          setPassword("");
        }}
        disabled={loading}
      >
        {isRegister ? "Already have an account? Login" : "Don't have an account? Sign up"}
      </Button>
    </Container>
  );
}
