// ✅ Cleaned and Updated: Blog.js

import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Main from './Main';
import Notification from '../models/Notification';
import post1 from './blog-post.1.md';
import post2 from './blog-post.2.md';
import post3 from './blog-post.3.md';
import { Divider, Box, Button, CircularProgress, Typography } from '@mui/material';
import Posts from '../models/Posts';
import { useNavigate } from "react-router-dom";
import { getTopics } from "../controllers/TopicController";
import { getUserSubscriptions } from "../controllers/SubscriptionController";
import authService from "../../services/authService";

const sections = getTopics().map((topic) => ({
  title: topic,
  url: "#",
}));

const mainFeaturedPost = {
  title: 'How Can Technology Support Business Sustainability?',
  description: "Companies can play an important role in environmental protection by investing in sustainability.",
  image: 'https://i.postimg.cc/m2kCn2YS/tech-sustainability.jpg',
  imageText: 'Dev Blog',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'How to Use GitHub Discussions as Your Blog\'s Chat System',
    date: 'Nov 12',
    description: 'GitHub discussions is a forum that can be enabled on every GitHub repository...',
    image: 'https://i.postimg.cc/L8ZfHC0Y/download.png',
    imageLabel: 'Github',
  },
  {
    title: 'A Complete Beginner’s Guide on How to Earn by Writing Articles',
    date: 'Nov 11',
    description: 'I still remember being inundated with those ads that promise you it’s “easy”...',
    image: 'https://i.postimg.cc/8zDD5sZR/Screenshot-2025-03-08-153238.png',
    imageLabel: 'Article',
  },
];

const posts = [post1, post2, post3];

const sidebar = {
  title: 'About',
  description: 'Welcome to \"Blog\", your go-to resource for everything related to Softwares, e.g., React development, tech tutorials, coding best practices, etc.!',
  archives: [
    { title: 'March 2020', url: '#' },
    { title: 'February 2020', url: '#' },
    { title: 'January 2020', url: '#' },
    { title: 'November 1999', url: '#' },
    { title: 'October 1999', url: '#' },
    { title: 'September 1999', url: '#' },
    { title: 'August 1999', url: '#' },
    { title: 'July 1999', url: '#' },
    { title: 'June 1999', url: '#' },
    { title: 'May 1999', url: '#' },
    { title: 'April 1999', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'X', icon: XIcon },
    { name: 'Facebook', icon: FacebookIcon },
  ],
};

const defaultTheme = createTheme({
  typography: { fontFamily: "Halyard" },
  palette: {
    primary: { main: "#4A90E2" },
    secondary: { main: "#D81B60" },
  },
});

export default function Blog({ userRole, onLogout }) {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const userEmail = authService.getUserEmail() || `${userRole?.toLowerCase()}@example.com`;
  const [subscriptions, setSubscriptions] = useState(getUserSubscriptions(userEmail));
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubscriptionChange = () => setSubscriptions(getUserSubscriptions(userEmail));

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ position: "relative", zIndex: 10 ,width: "100%", backgroundColor: "#e0dede" }}>      
        <Container maxWidth="lg">
          <Header
            justifyContent="center"
            title={`Blog - ${userRole || 'Guest'}`}
            sections={sections}
            userRole={userRole}
            onLogout={onLogout}
            onTopicSelect={(topic) => {
              setSelectedTopic(topic === "All Posts" ? null : topic);
            }}
            selectedTopic={selectedTopic}
            onSubscriptionChange={handleSubscriptionChange}
            onSearch={(query) => setSearchQuery(query)}
          />

          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            {userRole === "Administrator" && (
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => navigate("/admin")}>Manage Users</Button>
              </Grid>
            )}
          </Grid>

          <MainFeaturedPost post={mainFeaturedPost} />

          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>

          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Grid item xs={12} md={8}>
              <Box sx={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" }}>
                <Posts userRole={userRole} selectedTopic={selectedTopic} searchQuery={searchQuery} onClearTopic={() => setSelectedTopic(null)} />
              </Box>
              <Box sx={{ mt: 5 }}>
                <Divider sx={{ mb: 3, borderColor: "#D81B60", height: 2, opacity: 0.8 }} />
                <Main title="From the Firehose" userRole={userRole} firehosePosts={posts} />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Sidebar
                title={sidebar.title}
                description={sidebar.description}
                archives={sidebar.archives}
                social={sidebar.social}
                onTopicSelect={setSelectedTopic}
                selectedTopic={selectedTopic}
                subscriptions={subscriptions}
                sx={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px", boxShadow: "0px 2px 8px rgba(0,0,0,0.1)" }}
              />
              <Notification userEmail={userEmail} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer title="Stay Updated!" description="Subscribe for the latest blog updates, tutorials, and coding tips!" />
    </ThemeProvider>
  );
}
