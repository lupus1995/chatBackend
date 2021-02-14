import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import * as nodeMailer from 'nodemailer';
import * as pug from 'pug';

@Injectable()
export class MailService {
  async sendEmail({ email, id }: { email: string; id: string }): Promise<void> {
    const compiledFunction = pug.compileFile(
      resolve(`${__dirname}/../../templateMail/index.pug`),
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

    await transporter.sendMail({
      from: 'canya.panfilov.95@mail.ru',
      to: email,
      subject: 'Confirm email',
      text: 'Confirm email',
      html: compiledFunction({
        link: `http://localhost:3000/verify/${id}`,
      }),
    });
  }
}
