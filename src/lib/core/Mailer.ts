import sendGrid from '@sendgrid/mail';
import Handlebars from 'handlebars';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export interface ISendEmail<T extends Record<string, any>> {
  email: string;
  subject: string;
  templateName: string;
  data: T;
}

export interface IMailerParams {
  apiKey: string;
  templatePath: string;
  from: string;
}

export default class Mailer {
  sender = sendGrid;

  templatePath: string;

  templateSources: Record<string, HandlebarsTemplateDelegate<any>> = {};

  from: string;

  constructor(params: IMailerParams) {
    this.sender.setApiKey(params.apiKey);
    this.templatePath = params.templatePath;
    this.from = params.from;

    readdirSync(this.templatePath)
      .filter((temp) => temp.includes('.hbs'))
      .forEach(($path) => {
        this.templateSources[$path.replace('.hbs', '')] = this.#compileTemplates(join(this.templatePath, $path));
      });
  }

  // eslint-disable-next-line class-methods-use-this
  #compileTemplates(templatePath: string) {
    const source = readFileSync(templatePath, 'utf8');
    return Handlebars.compile(source);
  }

  async sendEmail<T extends Record<string, any>>(params: ISendEmail<T>) {
    const { email, subject, templateName, data } = params;

    if (!Object.keys(this.templateSources).includes(templateName)) {
      throw Error('template not found');
    }
    return this.sender
      .send({
        html: this.templateSources[templateName](data),
        from: this.from,
        subject,
        to: email,
      })
      .catch((e) => {
        throw new Error(`${e.message}: ${e.response?.body?.errors?.map((re: { message: string }) => re.message)}`);
      });
  }
}
