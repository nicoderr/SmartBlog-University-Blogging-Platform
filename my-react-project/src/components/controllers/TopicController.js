import topics from "../models/Topic"; // ✅ Correct path

export function getTopics() {
  return topics;
}

export function isValidTopic(topic) {
  return topics.includes(topic);
}

const subscriptionKey = "topicSubscriptions";

function getAllSubscriptions() {
  return JSON.parse(localStorage.getItem(subscriptionKey)) || {};
}

export function attachObserver(userEmail, topic) {
  const subs = getAllSubscriptions();
  if (!subs[topic]) subs[topic] = [];
  if (!subs[topic].includes(userEmail)) {
    subs[topic].push(userEmail);
    localStorage.setItem(subscriptionKey, JSON.stringify(subs));
  }
}

export function detachObserver(userEmail, topic) {
  const subs = getAllSubscriptions();
  if (subs[topic]) {
    subs[topic] = subs[topic].filter(email => email !== userEmail);
    localStorage.setItem(subscriptionKey, JSON.stringify(subs));
  }
}

export const notifyObservers = (topic, post) => {
  const subs = JSON.parse(localStorage.getItem("topicSubscriptions")) || {};
  const observers = subs[topic] || [];

  const notifications = JSON.parse(localStorage.getItem("notifications")) || {};

  observers.forEach((email) => {
    if (!notifications[email]) notifications[email] = [];
    notifications[email].push({
      topic,
      postText: post.text,
      createdAt: post.createdAt,
    });
  });

  localStorage.setItem("notifications", JSON.stringify(notifications));
};

