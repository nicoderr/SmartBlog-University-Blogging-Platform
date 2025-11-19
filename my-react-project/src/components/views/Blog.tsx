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
import post1 from './blog-post.1.md';
import post2 from './blog-post.2.md';
import post3 from './blog-post.3.md';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import {Box} from '@mui/material';
import Posts from '../models/Posts';
import { useNavigate } from "react-router-dom";
import { getTopics } from "../controllers/TopicController";

// Get topics dynamically
const sections = getTopics().map((topic) => ({
  title: topic,
  url: "#",
}));

const mainFeaturedPost = {
  title: 'How Can Technology Support Business Sustainability?',
  description:
    "Companies can play an important role in environmental protection by investing in sustainability.",
  image: 'https://i.postimg.cc/m2kCn2YS/tech-sustainability.jpg',
  imageText: 'Dev Blog',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'How to Use GitHub Discussions as Your Blog\'s Chat System',
    date: 'Nov 12',
    description:
      'GitHub discussions is a forum that can be enabled on every GitHub repository. It makes it easy for developers to discuss new features, get feedback from the community, create polls, make announcements, and more.',
    image: 'https://i.postimg.cc/L8ZfHC0Y/download.png',
    imageLabel: 'Github',
  },
  {
    title: 'A Complete Beginner’s Guide on How to Earn by Writing Articles',
    date: 'Nov 11',
    description:
      'I still remember being inundated with those ads that promise you it’s “easy” to figure out how to earn by writing articles. It’s not easy to earn money online by writing, certainly not as a beginner.',
    image: 'https://i.postimg.cc/8zDD5sZR/Screenshot-2025-03-08-153238.png',
    imageLabel: 'Article',
  },
];

const posts = [post1, post2, post3];

const sidebar = {
  title: 'About',
  description:
    'Welcome to \'Blog\', your go-to resource for everything related to Softwares, e.g., React development, tech tutorials, coding best practices, etc.!.',
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

const defaultTheme = createTheme();

export default function Blog({ userRole, onLogout }) {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = React.useState(null);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
      <Header title={`Blog - ${userRole || 'Guest'}`} sections={sections} userRole={userRole} onLogout={onLogout} onTopicSelect={setSelectedTopic} selectedTopic={selectedTopic}/>
      

        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          {userRole === "Administrator" && (
            <Button variant="contained" color="primary" onClick={() => navigate("/admin")}>
              Manage Users
            </Button>
          )}

          
        </Grid>

        <MainFeaturedPost post={mainFeaturedPost} />

        <Grid container spacing={4}>
          {featuredPosts.map((post) => (
            <FeaturedPost key={post.title} post={post} />
          ))}
        </Grid>

        <Grid container spacing={5} sx={{ mt: 3 }}>
         
         {/* ✅ Posts Section */}
<Grid item xs={12} md={8}>
  <Posts userRole={userRole} selectedTopic={selectedTopic} />
  
  {/* ✅ Add Space and a Divider Above "From the Firehose" */}
  <Box sx={{ mt: 5 }}>  {/* Adds vertical spacing */}
    <Divider sx={{ mb: 3, backgroundColor: "#D1D5DB", height: 2 }} />  {/* Horizontal line */}
    <Main title="From the Firehose" userRole={userRole} firehosePosts={posts} />
  </Box>
</Grid>


          {/* ✅ Sidebar Section */}
          <Grid item xs={12} md={4} >
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer
        title="Stay Updated!"
        description="Subscribe for the latest blog updates, tutorials, and coding tips!"
      />
    </ThemeProvider>
  );
}