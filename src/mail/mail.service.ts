import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import * as nodeMailer from 'nodemailer';
import * as pug from 'pug';

@Injectable()
export class MailService {
  async sendEmail({ email, id }: { email: string; id: string }): Promise<void> {
    const compiledFunction = pug.compileFile(
      resolve(`${__dirname}${process.env.PATH_TO_TEMPLATE}`),
    );
    let sender = email;

    if (process.env.EMAIL_REPLACE === 'true') {
      sender = 'emery.bruen@ethereal.email';
    }

    const transporter = nodeMailer.createTransport({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: 'canya.panfilov.95@mail.ru',
      to: sender,
      subject: 'Confirm email',
      text: 'Confirm email',
      html: compiledFunction({
        link: `http://localhost:3000/verify/${id}`,
      }),
    });
  }
}
