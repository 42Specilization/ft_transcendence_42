import { Controller, Get } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { EmailDto } from './dto/email.dto';

@Controller('mailing')
export class MailingController {

  constructor(readonly mailingService: MailingService) {}
  
  @Get('send-mail')
  public sendMail() {
    const emailDto: EmailDto = {
      body: 'teste',
      subject: 'teste',
      emailTo: ['teste']
    };
    this.mailingService.sendMail(emailDto);
  }
  
}
