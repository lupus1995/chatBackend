import * as nodeMailer from 'nodemailer';
import * as pug from 'pug';
import { resolve } from 'path';

const sendEmail = async ({ email, id }: { email: string; id: string }) => {
  const compiledFunction = pug.compileFile(
    resolve(`${__dirname}/../../../templateMail/index.pug`),
  );

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
    to: email,
    subject: 'Hello',
    text: 'Hello world?',
    html: compiledFunction({
      link: `http://localhost:3000/verify/${id}`,
    }),
  });

  console.log(info);
};

export default sendEmail;
