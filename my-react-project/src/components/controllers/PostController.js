import { notifyObservers } from "./TopicController"; // ✅ Import Observer logic

const POSTS_KEY = "posts";

// ✅ Utility to fetch all posts
export function getPosts() {
  return JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
}

// ✅ Utility to convert File to Base64
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// ✅ Add post with optional image (Base64)
export async function addPost(author, text, topic, image) {
  const posts = getPosts();
  let imageUrl = null;

  if (image) {
    try {
      imageUrl = await convertToBase64(image);
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
  }

  const newPost = {
    id: Date.now(),
    author,
    text,
    topic,
    imageUrl, // ✅ Base64 string if present
    createdAt: new Date().toISOString(),
    replies: [],
  };

  const updatedPosts = [newPost, ...posts];
  localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));

  // ✅ Notify observers
  notifyObservers(topic, newPost);

  // ✅ Index in ElasticSearch (Requirement 3)
try {
  await fetch("http://localhost:5000/api/elasticsearch/index", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: newPost.id,
      author,
      topic,
      text
    })
  });
} catch (err) {
  console.error("ElasticSearch indexing failed:", err);
}
localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));

  return updatedPosts;
}

// ✅ Delete post and clean from notifications
export function deletePost(postId) {
  const posts = getPosts();
  const updatedPosts = posts.filter(post => post.id !== postId);
  localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));

  // ✅ Remove from notifications
  const notifications = JSON.parse(localStorage.getItem("notifications")) || {};
  for (const email in notifications) {
    notifications[email] = notifications[email].filter(n => n.postId !== postId);
  }
  localStorage.setItem("notifications", JSON.stringify(notifications));

  return updatedPosts;
}

// ✅ Add reply to a specific post
export function addReply(postId, replyText, replyAuthor) {
  const posts = getPosts().map((post) =>
    post.id === postId
      ? {
          ...post,
          replies: [...post.replies, { text: replyText, author: replyAuthor }],
        }
      : post
  );

  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return posts;
}
