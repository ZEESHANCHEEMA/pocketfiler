import { history } from "./navigateHelper";

export const handleNotificationClick = (type, targetId) => {
  if (!type) return;

  switch (type) {
    case "chat":
      history.push(`/chat/${targetId}`); // Redirect to chat screen
      break;
    case "order":
      history.push(`/order/${targetId}`); // Redirect to order details
      break;
    case "profile":
      history.push("/profile"); // Redirect to profile
      break;
    default:
      history.push("/home"); // Default redirection
  }
};
