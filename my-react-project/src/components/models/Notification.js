import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import IconButton from '@mui/material/IconButton';

export default function Notification({ userEmail }) {
  const [userNotifications, setUserNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, [userEmail]);

  const loadNotifications = () => {
    const allNotifications = JSON.parse(localStorage.getItem("notifications")) || {};
    const userNotes = allNotifications[userEmail] || [];
    const sorted = [...userNotes].reverse(); // Newest first
    setUserNotifications(sorted);
  };

  const handleClearNotifications = () => {
    const allNotifications = JSON.parse(localStorage.getItem("notifications")) || {};
    delete allNotifications[userEmail];
    localStorage.setItem("notifications", JSON.stringify(allNotifications));
    setUserNotifications([]);
  };

  return (
    <Box sx={{ bgcolor: "#e3f2fd", p: 2, mt: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h6">Notifications</Typography>
        {userNotifications.length > 0 && (
          <IconButton
            color="error"
            onClick={handleClearNotifications}
            size="small"
            title="Clear all"
            sx={{
              backgroundColor: "#f8d7da",
              "&:hover": { backgroundColor: "#f5c2c7" }
            }}
          >
            <ClearAllIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {userNotifications.length > 0 ? (
        userNotifications.map((note, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 1 }}>
            📢 New post in <b>{note.topic}</b>: "{note.postText}"
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No notifications yet.
        </Typography>
      )}
    </Box>
  );
}
