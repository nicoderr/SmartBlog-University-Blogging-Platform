export async function generateAIReply(postText, topic) {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You're a friendly blog user replying casually to posts on the topic "${topic}". Respond in a relatable and conversational tone. Do not mention if the comment is off-topic — just keep the reply positive, fun, or curious based on the message.` 
            },
            {
              role: "user",
              content: `Reply to this blog post: "${postText}"`
            }
          ],
          temperature: 0.5,
          max_tokens: 40,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("OpenAI error:", data);
        return "Could not generate reply.";
      }
  
      return data.choices?.[0]?.message?.content?.trim() || "Could not generate reply.";
    } catch (error) {
      console.error("Fetch failed:", error);
      return "Could not generate reply.";
    }
  }
  