import { IRequest, error } from 'itty-router';
import { router } from './../index';
import { CookieBuilder } from '../CookieBuilder';

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
	const cookie = new CookieBuilder('refreshToken', '').build();
    return new Response(null, {
        headers: {
            'Set-Cookie': cookie,
        },
    });
});

// Function to parse cookie string into key-value pairs
function parseCookies(cookieString: string): { [key: string]: string } {
	return cookieString.split(';').reduce((cookies: { [key: string]: string }, cookie) => {
		const [name, value] = cookie.trim().split('=').map(decodeURIComponent);
		cookies[name] = value;
		return cookies;
	}, {});
}

