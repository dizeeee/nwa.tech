import { Resend } from 'resend';

export function getResend(token: string) {
	return new Resend(token);
}
