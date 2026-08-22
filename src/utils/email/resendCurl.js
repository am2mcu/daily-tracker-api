import env from "../../config/env.js";

export const sendEmail = async (to, title, content) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.EMAIL_SENDER,
      to,
      subject: title,
      html: `<p>${content}</p>`,
    }),
  });

  const data = await res.json();

  console.log(data);

  return data.id;
};
