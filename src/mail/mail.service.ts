import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  private obtenerTemplate(templateName: string, context: any): string {
    const templatePath = path.join(__dirname, '..', 'public', 'template', `${templateName}.hbs`);
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    return template(context);
  }

  async sendEmail(body) {
    const html = this.obtenerTemplate('mensaje', {
      nombre: body.nombre,
      email: body.email,
      mensaje: body.mensaje
    });

    await this.transporter.sendMail({
      from: "Consulta",
      to: 'alesiog.18@gmail.com',
      subject: 'Consulta Bajo Cero',
      html,
    });

    return { success: true, message: 'Correo enviado exitosamente.' };
  }
}
