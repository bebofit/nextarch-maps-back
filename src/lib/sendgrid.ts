import sgMail from '@sendgrid/mail';
import config from '../config';

const { SENDGRID_API } = config;

sgMail.setApiKey(SENDGRID_API);

export default sgMail;
