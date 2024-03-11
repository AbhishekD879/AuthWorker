import { IRequest, error } from 'itty-router';
import { Env, router } from './../index';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../jwtUtils';
import { CookieBuilder } from '../CookieBuilder';

export const refreshRoute = () => {
	router.get('/auth/refresh', async (request: IRequest, env: Env) => {
		const cookieHeader = request.headers.get('Cookie');
		if (!cookieHeader) {
			console.log('Cookies Not attached to refresh request');
			return error(400, { message: 'Cookies Not attached to refresh request' });
		}
		const cookies = parseCookies(cookieHeader);
		const refreshToken = cookies.r_token;
		console.log(`Refresh token: ${refreshToken}`);
		if (!refreshToken) {
			console.log('Refresh token not found');
			return error(400, { message: 'Refresh token not found' });
		}
		const user = cookies.u_info;
		console.log(`User: ${JSON.parse(user).email}`);
		if (!user) {
			console.log('User not found');
			return error(400, { message: 'User Cookie not found' });
		}

		const isRefreshValid = await verifyRefreshToken(refreshToken, env.JWT_SECRET_KEY);
		if (!isRefreshValid) {
			console.log('Refresh token is invalid Please Login');
			return error(400, { message: 'Refresh token is invalid Please Login' });
		}
		const accessToken = await createAccessToken(JSON.parse(user).email, env.JWT_SECRET_KEY, env.ENVIRONMENT);
		if (!accessToken) {
			console.log('Internal server error cannot create access token');
			return error(500, { message: 'Internal server error cannot create access token' });
		}
		const response = new Response(JSON.stringify({ accessToken }), {
			status: 200,
			statusText: 'REFRESH_SUCCESSFUL',
		});
		const newRefreshToken = await createRefreshToken(JSON.parse(user).email, env.JWT_SECRET_KEY, env.ENVIRONMENT);
		if (!newRefreshToken) {
			console.log('Internal server error cannot create refresh token');
			return error(500, { message: 'Internal server error cannot create refresh token' });
		}
		const cookie = new CookieBuilder('r_token', refreshToken)
			.setHttpOnly(true)
			.setPath('/')
			.setSameSite('Strict')
			.setSecure(env.ENVIRONMENT === 'development' ? false : true)
			.build(); // Example cookie string
		console.info(`Sending Cookie:~ ${cookie}`);
		response.headers.append('Set-Cookie', cookie);
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
