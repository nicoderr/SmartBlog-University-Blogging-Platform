import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Markdown from "./Markdown";
import { Buffer } from "buffer";
import matter from "gray-matter";

export default function Main({ title, firehosePosts }) {
  window.Buffer = window.Buffer || Buffer;

  const [loadedPosts, setLoadedPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await Promise.all(
        firehosePosts.map(async (post) => {
          if (typeof post === "string" && post.includes(".md")) {
            try {
              const response = await fetch(post);
              const text = await response.text();
              return text;
            } catch (error) {
              console.error("Error loading markdown file:", post, error);
              return "";
            }
          }
          return post;
        })
      );
      setLoadedPosts(fetchedPosts);
    };

    fetchPosts();
  }, [firehosePosts]);

  return (
    <Grid item xs={12} md={8}>
      {/* ✅ Title is left-aligned now */}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ fontWeight: "bold", color: "#2E3B55", textAlign: "left" }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 2, backgroundColor: "#D1D5DB", height: 2 }} />

      {loadedPosts.length > 0 ? (
        <>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ mt: 3, color: "#374151", fontWeight: "600", textAlign: "left" }}
          >
            Blog Posts from Firehose
          </Typography>
          <List>
            {loadedPosts.map((post, index) => {
              let content = post;
              let data = {};
              try {
                const parsed = matter(post);
                content = parsed.content;
                data = parsed.data;
              } catch (error) {
                console.error("Error parsing Markdown:", error);
              }

              return (
                <Card 
                  key={index} 
                  sx={{ 
                    marginBottom: 3, 
                    p: 2, 
                    backgroundColor: "#F3F4F6",  // ✅ Light gray background
                    borderRadius: 3, 
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.02)", boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" }
                  }}
                >
                  <CardContent>
                    {data.title && (
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ color: "#1E40AF", fontWeight: "bold" }}
                      >
                        {data.title}
                      </Typography>
                    )}
                    {data.date && data.author && (
                      <Typography 
                        variant="subtitle2" 
                        color="textSecondary"
                        sx={{ color: "#6B7280", fontStyle: "italic", mb: 1 }}
                      >
                        {data.date} by {data.author}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2, color: "#374151" }}>
                      <Markdown>{content}</Markdown>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </List>
        </>
      ) : (
        <Typography 
          variant="body1" 
          color="textSecondary"
          sx={{ textAlign: "center", color: "#9CA3AF", fontStyle: "italic" }}
        >
          No blog posts available.
        </Typography>
      )}
    </Grid>
  );
}

// ✅ PropTypes validation
Main.propTypes = {
  title: PropTypes.string.isRequired,
  firehosePosts: PropTypes.array.isRequired,
};
