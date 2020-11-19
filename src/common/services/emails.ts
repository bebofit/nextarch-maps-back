// import ejs from 'ejs';
// import path from 'path';
// import { translation } from '../../assets/i18n';
// import config from '../../config';
// import transport from '../../lib/nodemailer';
// import { EmailTemplate } from '../enums';
// import { generateOtp } from '../utils';

// const { MAILER_SENDER } = config;

// const renderHtmlTemplate = (
//   templatePath: string,
//   data?: ejs.Data,
//   options?: ejs.Options
// ): Promise<string> => ejs.renderFile(templatePath, data, options);

// async function sendMail(
//   to: string,
//   subject: string,
//   html: string,
//   replyTo?: string
// ): Promise<void> {
//   await transport.sendMail({
//     to,
//     subject,
//     html,
//     replyTo,
//     from: MAILER_SENDER
//   });
// }

// async function sendVerificationMail(
//   email: string,
//   language: string,
//   otp: number
// ): Promise<void> {
//   const { subject, body } = (translation as any)[
//     language
//   ].emailTemplates.emailVerification(otp);
//   body.email = email;
//   const html = await renderHtmlTemplate(
//     path.resolve(
//       'src',
//       'assets',
//       'email-templates',
//       `${EmailTemplate.General}.ejs`
//     ),
//     body
//   );
//   await sendMail(email, subject, html);
// }

// async function sendForgotPasswordMail(
//   email: string,
//   language: string,
//   otp: number
// ): Promise<void> {
//   const { subject, body } = (translation as any)[
//     language
//   ].emailTemplates.forgotPassword(otp);
//   body.email = email;
//   const html = await renderHtmlTemplate(
//     path.resolve(
//       'src',
//       'assets',
//       'email-templates',
//       `${EmailTemplate.General}.ejs`
//     ),
//     body
//   );
//   await sendMail(email, subject, html);
// }

// export {
//   renderHtmlTemplate,
//   sendMail,
//   sendVerificationMail,
//   sendForgotPasswordMail
// };
