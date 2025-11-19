import { attachObserver, detachObserver } from "./TopicController";

export function subscribeToTopic(userEmail, topic) {
  attachObserver(userEmail, topic);
  return `Subscribed to ${topic}`;
}

export function unsubscribeFromTopic(userEmail, topic) {
  detachObserver(userEmail, topic);
  return `Unsubscribed from ${topic}`;
}

export function getUserSubscriptions(userEmail) {
  const subs = JSON.parse(localStorage.getItem("topicSubscriptions")) || {};
  return Object.keys(subs).filter(topic => subs[topic].includes(userEmail));
}

export function isUserSubscribed(userEmail, topic) {
  const subs = JSON.parse(localStorage.getItem("topicSubscriptions")) || {};
  return subs[topic]?.includes(userEmail);
}
