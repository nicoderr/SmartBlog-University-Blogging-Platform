// ✅ Updated Header.js with modular recommendation logic

import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  subscribeToTopic,
  unsubscribeFromTopic,
  isUserSubscribed,
} from "../controllers/SubscriptionController";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from "@mui/material/CircularProgress";
import RecommendationPopup from "./RecommendationPopup"; // new component

function Header({ sections, title, userRole, onLogout, onTopicSelect, selectedTopic, onSubscriptionChange, onSearch }) {
  const userEmail = localStorage.getItem("userEmail") || `${userRole?.toLowerCase()}@example.com`;
  const [subscriptionMessage, setSubscriptionMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState(false);

  const handleOpenRecommendationPopup = () => setOpenPopup(true);
  const handleClosePopup = () => setOpenPopup(false);

  React.useEffect(() => {
    if (subscriptionMessage) {
      const timer = setTimeout(() => {
        setSubscriptionMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionMessage]);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1300,
        width:"100%",
        bgcolor: "#e0e0e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fff !important",
      }}
    >
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {selectedTopic && userRole && (
          <Button
            size="small"
            color="secondary"
            onClick={() => {
              const isSubscribed = isUserSubscribed(userEmail, selectedTopic);
              const msg = isSubscribed
                ? unsubscribeFromTopic(userEmail, selectedTopic)
                : subscribeToTopic(userEmail, selectedTopic);
              setSubscriptionMessage(msg);
              setOpenSnackbar(true);
              if (onSubscriptionChange) {
                onSubscriptionChange();
              }
            }}
          >
            {isUserSubscribed(userEmail, selectedTopic) ? "Unsubscribe" : "Subscribe"}
          </Button>
        )}

        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{
            flex: 1,
            padding: "8px 16px",
            borderRadius: "6px",
            color: "#001F3F",
            fontWeight: "bold"
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SearchIcon />
          <TextField
            placeholder="Search posts..."
            variant="standard"
            size="small"
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSearch) {
                onSearch(e.target.value);
              }
            }}
            sx={{ width: 200 }}
          />
          <Button variant="outlined" size="small" onClick={handleOpenRecommendationPopup}>
            Recommended For You
          </Button>
          {userRole ? (
            <Button variant="outlined" size="small" onClick={onLogout} color="secondary">
              Logout
            </Button>
          ) : (
            <Button variant="outlined" size="small">
              Sign up
            </Button>
          )}
        </Box>
      </Toolbar>

      <Toolbar
        component="nav"
        variant="dense"
        sx={{
          justifyContent: "flex-start",
          overflowX: "auto",
          whiteSpace: "nowrap",
          height: "60px",
          borderBottom: "2px solid #ddd",
          px: 1,
        }}
      >
        {sections.map((section) => (
          <Button
            key={section.title}
            color="inherit"
            onClick={(e) => {
              e.preventDefault();
              onTopicSelect(section.title === "All Posts" ? null : section.title);
            }}
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontFamily: "inherit",
              fontWeight: selectedTopic === section.title ? 500 : 400,
              color: "#001F3F",
              borderBottom: selectedTopic === section.title ? "2px solid #001F3F" : "2px solid transparent",
              paddingBottom: "6px",
              minWidth: "max-content",
              lineHeight: "1.5",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "transparent",
                cursor: "pointer"
              },
              "& span": {
                display: "inline-block",
                minWidth: "80px",
              }
            }}
          >
            {section.title}
          </Button>
        ))}
      </Toolbar>

      {/* Snackbar for Subscription Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {subscriptionMessage}
        </MuiAlert>
      </Snackbar>

      {/* Recommendation Modal */}
      <RecommendationPopup open={openPopup} onClose={handleClosePopup} />
    </Box>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  userRole: PropTypes.string,
  onLogout: PropTypes.func,
  onTopicSelect: PropTypes.func.isRequired,
  selectedTopic: PropTypes.string,
  onSubscriptionChange: PropTypes.func,
};

export default Header;
