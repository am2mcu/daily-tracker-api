export const getToday = () => {
  const now = new Date();
  return now.toLocaleDateString();
};
