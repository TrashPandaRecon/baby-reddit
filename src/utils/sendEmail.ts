import nodemailer from 'nodemailer';
import {TEST_EMAIL_ACCOUNT_PASSWORD, TEST_EMAIL_ACCOUNT_USER} from '../constants';

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string, subject: string) {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	// let testAccount = await nodemailer.createTestAccount();
	// console.log(testAccount);

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: TEST_EMAIL_ACCOUNT_USER, // generated ethereal user
			pass: TEST_EMAIL_ACCOUNT_PASSWORD, // generated ethereal password
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Fred Foo 👻" <foo@example.com>', // sender address
		to: to, // list of receivers
		subject: subject, // Subject line
		html: html, // html body
	});

	console.log('Message sent: %s', info.messageId);
	
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

