// ModeratorController.js - Handles deleting posts
export function fetchPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  console.log("Fetched Posts:", posts); // Debugging log
  return posts;
}


export function deletePost(postId) {
  let posts = fetchPosts();
  console.log("Before Deletion:", posts); // Debugging log

  const updatedPosts = posts.filter(post => post.id !== postId);
  console.log("After Deletion:", updatedPosts); // Debugging log

  localStorage.setItem("posts", JSON.stringify(updatedPosts));
  return updatedPosts;
}
