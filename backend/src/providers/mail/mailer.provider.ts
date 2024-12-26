import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailerProvider {
  constructor(
    private readonly mailerService: MailerService, // private readonly logger: WinstonLoggerService
  ) {}

  public async sendApproveAccountEmail(email, content): Promise<void> {
    if (email) {
      this.mailerService
        .sendMail({
          to: email,
          from: __('app.email.sender'),
          subject: __('app.email.titleApprove'),
          template: `${process.cwd()}/src/third-parties/mail/templates/approve-account`,
          context: {
            // Data to be sent to template engine.
            name: content.name || 'Sir',
            email,
            password: content.password,
            // login_page: `${loadConfig?.app?.domain}/login`
          },
        })
        .then((res) => {
          Logger.log(res);
        })
        .catch((err) => {
          Logger.error(err);
        });
    }
  }
}
