import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,      // Sender address
    to: options.to,                    // Receiver
    subject: options.subject,          // Subject
    text: options.message,             // Email message
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
