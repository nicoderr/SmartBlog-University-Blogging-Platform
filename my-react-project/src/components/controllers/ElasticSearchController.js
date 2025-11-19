const BASE_URL = "http://localhost:5000"; // Change if using different port

export async function indexPostToElastic(post) {
  const response = await fetch(`${BASE_URL}/api/elasticsearch/index`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return response.json();
}

export async function searchElasticPosts(query) {
  const response = await fetch(`${BASE_URL}/api/elasticsearch/search?q=${encodeURIComponent(query)}`);
  return response.json();
}
