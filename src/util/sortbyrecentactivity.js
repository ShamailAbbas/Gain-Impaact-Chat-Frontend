export default function sortbyrecentactivity(users) {
  const recentactivity = users.map((user) => {
    let recentactivity = user.latestMessage.createdAt;
    if (user.latestMessage.createdAt === null) recentactivity = user.createdAt;
    return { ...user, recentactivity: recentactivity };
  });
  return recentactivity.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.recentactivity) - new Date(a.recentactivity);
  });
}
