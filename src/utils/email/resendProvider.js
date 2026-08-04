import { Resend } from "resend";
import env from "../../config/env.js";

const provider = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (to, title, content) => {
  const { data } = await provider.emails.send({
    from: env.EMAIL_SENDER,
    to,
    subject: title,
    html: `<p>${content}</p>`,
  });

  return data.id;
};
