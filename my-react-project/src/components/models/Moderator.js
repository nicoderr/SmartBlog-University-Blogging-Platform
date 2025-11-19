import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { fetchPosts, deletePost } from "../controllers/ModeratorController"; // Import logic

export default function Moderator() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(fetchPosts()); // Load posts on mount
  }, []);

  const handleDelete = (postId) => {
    console.log("Delete button clicked for post:", postId); // Debugging log
  
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    
    if (isConfirmed) {
      console.log("User confirmed deletion."); // Debugging log
      const updatedPosts = deletePost(postId);
      console.log("Updated Posts:", updatedPosts); // Debugging log
  
      setPosts(updatedPosts); // Ensure UI updates
    } else {
      console.log("User cancelled deletion."); // Debugging log
    }
  };
    

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Manage Blog Posts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
