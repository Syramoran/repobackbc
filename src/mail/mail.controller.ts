import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly emailService: EmailService) { }

    // Solución con destructuring sin DTO
    @Post('send')
    async sendEmail(
        @Body() body: { nombre: string; email: string; mensaje: string },
        @Res() res: Response
    ) {
        try {
            const { nombre, email, mensaje } = body;
            const response = await this.emailService.sendEmail(body);
            res.status(HttpStatus.OK).send(response);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message: 'Error al enviar el correo.' });
        }
    }

}
