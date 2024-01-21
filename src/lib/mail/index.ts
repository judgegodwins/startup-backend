import config, { AppEnvironmentEnum } from '../../config';
import Mailer, { ISendEmail } from '../core/Mailer';

class AppMail extends Mailer {
  async sendMail<T extends Record<string, any>>(params: ISendEmail<T>) {
    if (
      [
        AppEnvironmentEnum.LOCAL,
        AppEnvironmentEnum.DEVELOPMENT,
        AppEnvironmentEnum.STAGING,
        AppEnvironmentEnum.PRODUCTION,
      ].includes(config.app.env) &&
      params.email
    ) {
      await this.sendEmail(params);
    }
  }

  async sendPasswordResetMail(params: { email: string; link: string }) {
    const { email, link } = params;
    await this.sendMail<{ link: string }>({
      templateName: 'reset-password',
      subject: 'Password Reset',
      email,
      data: {
        link,
      },
    });
  }

  async sendEmailVerificationLinkRequest(
    email: string,
    data: {
      link: string;
    }
  ) {
    await this.sendEmail<{
      link: string;
      email: string;
    }>({
      templateName: 'email-verification',
      subject: 'Email Verification',
      email,
      data: { ...data, email },
    });
  }

  async sendInterviewSchedule(email: string, data: { link: string; date: string; recruiter: string }) {
    await this.sendMail({
      templateName: 'interview-schedule',
      subject: 'Interview Schedule',
      email,
      data,
    });
  }

  async sendJobInvitation(email: string, data: { jobTitle: string; link: string; recruiter: string }) {
    await this.sendMail({
      templateName: 'job-invitation',
      subject: `Job Invitation from ${data.recruiter}`,
      email,
      data,
    });
  }

  async sendProfileReviewRequest(email: string, data: { name: string }) {
    await this.sendMail({
      templateName: 'request-review',
      subject: 'Paxity Profile Review',
      email,
      data,
    });
  }
}

export default new AppMail({
  templatePath: config.app.templatePath,
  apiKey: config.sendgrid.apiKey,
  from: config.sendgrid.from,
});
