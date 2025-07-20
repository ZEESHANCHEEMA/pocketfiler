import moment from "moment";

export const JSONParsing = (val) => {
  try {
    const res = JSON.parse(val);
    return res;
  } catch (error) {
    return val;
  }
};
export function otpTimerCounter(seconds) {
  // alert(seconds)
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  return `${m}:${s}`;
}
export const toSentenceCase = (text) => {
  if (typeof text !== "string") {
    return;
  }

  text = text?.trim();

  if (text?.length === 0) {
    return "";
  }

  const lowerCaseText = text.toLowerCase();

  const sentenceCaseText =
    lowerCaseText.charAt(0).toUpperCase() + lowerCaseText.slice(1);

  return sentenceCaseText;
};

export const timeAgo = (createdAt) => {
  return moment(createdAt).fromNow();
};
export const formatMessageTime = (isoDate) => {
  const date = moment(isoDate);
  const now = moment();

  if (now.diff(date, "seconds") < 60) {
    return "Just now";
  } else if (now.diff(date, "hours") < 24) {
    return date.fromNow(); // Example: "5 hours ago"
  } else if (now.isSame(date, "year")) {
    return date.format("MMM D, h:mm A"); // Example: "Feb 15, 2:30 PM"
  } else {
    return date.format("MMM D, YYYY, h:mm A"); // Example: "Feb 15, 2023, 2:30 PM"
  }
};

export const formatMessageDate = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString(); // Formats to "MM/DD/YYYY"
  }
};

export const formatTime = (createdAt) => {
  if (!createdAt) return "";
  const now = new Date();
  const date = new Date(createdAt);

  const diffInMs = now - date;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "Just Now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const isToday = now.toDateString() === date.toDateString();
  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() ===
    date.toDateString();

  if (isToday) {
    return `Today at ${formatToTime(date)}`;
  }
  if (isYesterday) {
    return `Yesterday at ${formatToTime(date)}`;
  }

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return `${date.toLocaleDateString()} at ${formatToTime(date)}`;
};

const formatToTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutes} ${ampm}`;
};
