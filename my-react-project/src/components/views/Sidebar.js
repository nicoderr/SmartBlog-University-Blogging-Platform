import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

function Sidebar(props) {
  const {
    archives,
    social,
    onTopicSelect,
    selectedTopic,
    subscriptions = [],
  } = props;

  return (
    <Stack spacing={3}>
      {/* ✅ About Section */}
      <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f4f4f4', borderRadius: 2 }}>
  {/* 📘 About */}
  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
    📘 About
  </Typography>
  <Typography color="text.secondary" fontSize="0.95rem">
    Welcome to <strong>'Blog'</strong>, your go-to resource for everything related to
    <em> React development, tech tutorials, coding best practices</em>, etc.!
  </Typography>
</Paper>

<Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#fff', borderRadius: 2 }}>
  {/* 🗂️ Archives */}
  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
    🗂️ Archives
  </Typography>
  {archives.map((archive) => (
    <Link
      key={archive.title}
      href={archive.url}
      variant="body2"
      underline="hover"
      sx={{
        display: 'block',
        color: '#333',
        padding: '3px 0',
        '&:hover': {
          color: '#D81B60',
          fontWeight: 500,
        }
      }}
    >
      • {archive.title}
    </Link>
  ))}
</Paper>

<Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#fff', borderRadius: 2 }}>
  {/* 📲 Social */}
  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
    📲 Social
  </Typography>
  {social.map((network) => (
    <Link
      key={network.name}
      href="#"
      variant="body2"
      underline="none"
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 1,
        color: '#333',
        '&:hover': {
          color: '#D81B60'
        }
      }}
    >
      <network.icon fontSize="small" sx={{ mr: 1 }} />
      {network.name}
    </Link>
  ))}
</Paper>

<Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#fff', borderRadius: 2 }}>
  {/* ⭐ My Subscriptions */}
  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
    ⭐ My Subscriptions
  </Typography>
  {subscriptions.length > 0 ? (
    <Box>
      {subscriptions.map((topic, index) => (
        <Typography
          key={index}
          onClick={() => onTopicSelect && onTopicSelect(topic)}
          variant="body2"
          sx={{
            cursor: 'pointer',
            px: 1,
            py: 0.5,
            mb: 0.5,
            borderRadius: '6px',
            backgroundColor:
              selectedTopic === topic ? '#ffe0ec' : 'transparent',
            fontWeight: selectedTopic === topic ? 500 : 400,
            '&:hover': {
              backgroundColor: '#ffe0ec',
              transition: '0.2s ease-in-out',
            },
          }}
        >
          • {topic}
        </Typography>
      ))}
    </Box>
  ) : (
    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
      You haven’t subscribed to any topics yet.
    </Typography>
  )}
</Paper>

    </Stack>
  );
}

Sidebar.propTypes = {
  archives: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  description: PropTypes.string.isRequired,
  social: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
  onTopicSelect: PropTypes.func,
  selectedTopic: PropTypes.string,
  subscriptions: PropTypes.arrayOf(PropTypes.string),
};

export default Sidebar;
