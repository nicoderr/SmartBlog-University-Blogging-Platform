const { Client } = require('@elastic/elasticsearch');

// ✅ Correct connection to Elasticsearch
const client = new Client({ node: 'http://localhost:9200', requestTimeout: 60000,  });

// ✅ Function to index a post in Elasticsearch
const addPostToIndex = async (req, res) => {
  const { id, author, topic, text } = req.body;

  try {
    console.log("🔹 Indexing Post to Elasticsearch:", req.body); // ✅ Add debug log

    const response = await client.index({
      index: "blog_posts",
      id: id,
      document: {
        author,
        topic,
        text,
        timestamp: new Date(),
      }
    });

    console.log("Indexed successfully:", response);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("ElasticSearch Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Function to search posts in Elasticsearch
const searchPosts = async (req, res) => {
  const { query } = req.body;

  try {
    const result = await client.search({
      index: "blog_posts",
      query: {
        multi_match: {
          query,
          fields: ["author", "topic", "text"],
        }
      }
    });

    console.log("Search results:", result.hits.hits);
    res.status(200).json({ success: true, data: result.hits.hits });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Export client and functions properly
module.exports = { client, addPostToIndex, searchPosts };
