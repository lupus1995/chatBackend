import * as nodeMailer from 'nodemailer';

const sendEmail = async () => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'canya.panfilov.95@mail.ru',
      pass: 'lupus1995',
    },
  });

  const info = await transporter.sendMail({
    from: 'canya.panfilov.95@mail.ru',
    to: 'canya.panfilov.95@gmail.com',
    subject: 'Hello',
    text: 'Hello world?',
    html: '<b>Hellp world html</b>',
  });

  console.log(info);
};

export default sendEmail;
