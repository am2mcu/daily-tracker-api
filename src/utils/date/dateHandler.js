export const getToday = () => {
  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

export const getYesterday = () => {
  const now = new Date();
  now.setDate(now.getDate() - 1);

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

export const isToday = (date) => {
  return date === getToday();
};

export const isYesterday = (date) => {
  return date === getYesterday();
};
