import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  Box
} from "@mui/material";
import { getPosts, addPost, addReply, deletePost } from "../controllers/PostController";
import { generateAIReply } from "../controllers/ReplyAIController";
import Switch from '@mui/material/Switch';
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import Chip from "@mui/material/Chip";


export default function Posts({ userRole, selectedTopic, searchQuery, onClearTopic}) {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [image, setImage] = useState(null); // ✅ Added image state
  const [selectedPostTopic, setSelectedPostTopic] = useState(selectedTopic || "Select Topics");
  const [aiEnabled, setAiEnabled] = useState({});
  const [loadingAI, setLoadingAI] = useState({});
  const [searchResults] = useState([]);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null); // ✅ reference for file input

  const filteredPosts = posts.filter((post) => {
    const matchesTopic = selectedTopic ? post.topic === selectedTopic : true;
    const matchesSearch = searchQuery
      ? post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
  
    return matchesTopic && matchesSearch;
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setPosts(getPosts()); // fallback to all posts
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:5000/api/elastic/search", {
          query: searchQuery
        });
        const hits = response.data.data;
        const formatted = hits.map(hit => hit._source); // format Elastic response
        setPosts(formatted); // override posts with search results
      } catch (error) {
        console.error("Search failed:", error);
      }
    };
  
    fetchSearchResults();
  }, [searchQuery]);
  

  // ✅ Function to add a new post
  const handleAddPost = async () => {
    if (postText.trim() === "") return;
    setPosting(true);
    const updatedPosts = await addPost(userRole, postText, selectedPostTopic || selectedTopic, image);
    setPosts(updatedPosts);
    setPostText("");
    setImage(null); // ✅ Clear image after posting
    setSelectedPostTopic("Select Topics"); // ✅ Reset dropdown

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ✅ Clear file input
    }
    setPosting(false); 
    window.scrollTo({ top: 0, behavior: "smooth" });

  };

   // ✅ Toggle reply input field when comment icon is clicked
  

  // ✅ Function to handle replies
  const handleAddReply = (postId) => {
    if (!replyText[postId] || replyText[postId].trim() === "") return;
    const updatedPosts = addReply(postId, replyText[postId], userRole);
    setPosts(updatedPosts);
    setReplyText({ ...replyText, [postId]: "" });
  };

  // ✅ Function to delete a post (Moderator Only)
  const handleDeletePost = (postId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (isConfirmed) {
        const updatedPosts = deletePost(postId);
        setPosts(updatedPosts);
    }
};


  return (
<Container maxWidth="md" sx={{ backgroundColor: "#e0dede", padding: "20px", borderRadius: "10px", // ✅ Move it UP
    boxShadow: "0px 3px 15px rgba(0,0,0,0.1)"}}>
{/* ✅ Show "View All Posts" button when a topic is selected */}
        {selectedTopic && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onClearTopic}
          sx={{ marginBottom: 2 }}
        >
          View All Posts
        </Button>
      )}
      
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "10px", padding: "10px", color: "#333", boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)", }}>
            Create Posts Here
          </Typography>

      {/* ✅ New Post Input (Only if userRole is set) */}
      {userRole && (
        <Card sx={{ marginBottom: 2, padding: 2 }}>
          <TextField
            label="Write a new post..."
            variant="outlined"
            fullWidth
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />

            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Select Topic</InputLabel>

              <Select 
              value={selectedPostTopic || selectedTopic} 
              onChange={(e) => setSelectedPostTopic(e.target.value)}
              displayEmpty
            >
                <MenuItem value="Select Topics" disabled>Select Topics</MenuItem> {/* Default*/}
                <MenuItem value="Academic Resources">Academic Resources</MenuItem>
                <MenuItem value="Career Services">Career Services</MenuItem>
                <MenuItem value="Campus">Campus</MenuItem>
                <MenuItem value="Culture">Culture</MenuItem>
                <MenuItem value="Local Community Resources">Local Community Resources</MenuItem>
                <MenuItem value="Social">Social</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Health and Wellness">Health and Wellness</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Travel">Travel</MenuItem>
                <MenuItem value="Alumni">Alumni</MenuItem>
              </Select>
            </FormControl>

          <input type="file"ref={fileInputRef}  onChange={(e) => setImage(e.target.files[0])} />
          {posting ? (
          <CircularProgress size={24} sx={{ marginTop: 1 }} />
        ) : (
          <Button variant="contained" color="secondary" onClick={handleAddPost} sx={{ marginTop: 1 }}>
            Post
          </Button>
        )}

        </Card>
      )}
            <Box sx={{  paddingLeft: "10px" }}>

      <Typography variant="body1" gutterBottom>
      {selectedTopic ? `You are viewing posts under ${selectedTopic}.` : "You are viewing all posts. Select a topic from Navbar to view filtered posts."}
      </Typography>
</Box>

      {/* ✅ Displaying all posts */}
      <List>
    {(searchResults.length > 0 ? searchResults : filteredPosts).length > 0 ? (
        filteredPosts.map((post) => (
          <Card key={post.id} sx={{ 
            marginBottom: 3, 
            backgroundColor: "#fff", 
            borderRadius: "15px", 
            boxShadow: "0px 4px 10px rgba(0,0,0,0.15)", 
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            padding: "15px"
        }}>
            <CardContent>
            <Chip
                    label={post.topic}
                    size="small"
                    sx={{
                      backgroundColor: "#e0f2f1",
                      color: "#004d40",
                      fontWeight: 500,
                    
                    }}
                  />  
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#000000" }}>
                    {post.author}
                  </Typography>                 
                </Box>

        
                {/* ✅ Post Image (If available) */}
                {post.imageUrl && (
                    <Box sx={{ width: "100%", overflow: "hidden"}}>
                    <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        style={{ 
                            width: "100%", 
                            height: "auto",
                            objectFit: "contain", 
                            borderRadius: "5px"
                        }} 
                    />
                    </Box>

                    )}
      
        
                {/* ✅ Post Content (Formatted as "Student: dd") */}
                <Typography variant="body1" sx={{ padding: "15px", color: "#000", fontSize: "1rem", lineHeight: "1.5" }}>
                    <strong>{post.author} </strong> {post.text}
                </Typography>
        
                {/* ✅ Replies Section */}
                <List sx={{ paddingLeft: 4 }}>
                    {post.replies.map((reply, index) => (
                        <ListItem key={index} sx={{ pl: 4, borderBottom: "1px solid #f0f0f0" }}>
                            <ListItemText primary={`${reply.author}: ${reply.text}`} />
                        </ListItem>
                    ))}
                </List>
        
                {/* ✅ Reply Input Section */}
                {userRole && (
                    <Box sx={{ padding: "2px", marginTop: "1px" }}>
                        {/* Reply Input Field (Hidden until comment icon is clicked) */}
                        <TextField
                            label="Write a reply..."
                            variant="outlined"
                            fullWidth
                            size="small"
                            margin="dense"
                            value={replyText[post.id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                            sx={{ marginBottom: 1, display: replyText[post.id] !== undefined ? "block" : "none" }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleAddReply(post.id)}
                                            disabled={!replyText[post.id]?.trim()}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
        
                        {/* AI Reply Toggle (Hidden until comment icon is clicked) */}
                        <Box sx={{ display: replyText[post.id] !== undefined ? "flex" : "none", alignItems: "center", marginBottom: "10px" }}>
                            <Switch
                                checked={aiEnabled[post.id] || false}
                                onChange={(e) => setAiEnabled({ ...aiEnabled, [post.id]: e.target.checked })}
                                inputProps={{ 'aria-label': 'AI Reply Toggle' }}
                            />
                            <Typography variant="caption" sx={{ marginLeft: "5px", color: "#555" }}>
                                Enable AI Reply
                            </Typography>
                        </Box>
        
                        {/* AI Reply Button */}
                        {aiEnabled[post.id] && replyText[post.id] !== undefined && (
                            <Button
                            variant="contained" // ✅ Make it filled instead of outlined
                            sx={{
                                marginRight: "10px",
                                backgroundColor: "#FF8FAB", // ✅ Change button background color (e.g., Pinkish)
                                color: "#fff", // ✅ Ensure text is white
                                "&:hover": { backgroundColor: "#FB6F92" } // ✅ Darker shade on hover
                            }}
                                disabled={loadingAI[post.id]}
                                onClick={async () => {
                                    setLoadingAI({ ...loadingAI, [post.id]: true });
                                    const aiReply = await generateAIReply(post.text, post.topic);
                                    setReplyText({ ...replyText, [post.id]: aiReply });
                                    setLoadingAI({ ...loadingAI, [post.id]: false });
                                }}
                            >
                                {loadingAI[post.id] ? "Generating..." : "Generate AI Reply"}
                            </Button>
                        )}
                    </Box>
                )}
        
                {/* ✅ Move Comment Icon BELOW Post Content (Clicking it Reveals Reply Input) */}
                <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginTop: "10px" }}>
                    <IconButton
                        color="primary"
                        onClick={() => setReplyText({ ...replyText, [post.id]: replyText[post.id] !== undefined ? undefined : "" })}
                        sx={{
                            backgroundColor: "#D81B60",
                            color: "#fff",
                            padding: "6px",
                            borderRadius: "50%",
                            transition: "0.3s",
                            "&:hover": { backgroundColor: "#B2184B" }
                        }}
                    >
                        <CommentIcon />
                    </IconButton>
                </Box>
        
                {/* ✅ Delete Button (Visible Only for Moderators) */}
                {userRole === "Moderator" && (
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleDeletePost(post.id)}
                        sx={{ marginTop: "10px" }}
                    >
                        Delete Post
                    </Button>
                )}
            </CardContent>
        </Card>
        

        ))
    ) : (
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center", padding: "20px" }}>
            No posts available. Start by creating a new post!
        </Typography>
    )}
</List>

    </Container>
  );
}
