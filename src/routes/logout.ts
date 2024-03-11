import { IRequest, error } from 'itty-router';
import { router } from './../index';
import { CookieBuilder } from '../CookieBuilder';

export const logoutRoute = () => {
	router.get('/auth/logout', (request: IRequest) => {
		const cookieHeader = request.headers.get('Cookie');
		if (!cookieHeader) {
			console.log('Cookies Not attached to refresh request');
			return error(400, { message: 'Cookies Not attached to refresh request' });
		}
		const cookies = parseCookies(cookieHeader);
		const refreshToken = cookies.r_token;
		if (!refreshToken) {
			console.warn('Refresh token not found');
		}
		const u_cookie = new CookieBuilder('u_info', '').setExpiresRelative(0, 0, 0, 0).build();
		const r_cookie = new CookieBuilder('r_token', '').setExpiresRelative(0, 0, 0, 0).build();
		const response = new Response(JSON.stringify({ message: 'Logout Successful' }), {
			status: 200,
			statusText: 'LOGOUT_SUCCESSFUL',
		});
		response.headers.append('Set-Cookie', r_cookie);
		response.headers.append('Set-Cookie', u_cookie);
		return response;
	});
};
// Function to parse cookie string into key-value pairs
function parseCookies(cookieString: string): { [key: string]: string } {
	return cookieString.split(';').reduce((cookies: { [key: string]: string }, cookie) => {
		const [name, value] = cookie.trim().split('=').map(decodeURIComponent);
		cookies[name] = value;
		return cookies;
	}, {});
}
