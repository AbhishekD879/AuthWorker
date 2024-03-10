import { IRequest, error } from 'itty-router';
import { Env, router } from './../index';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { createAccessToken, createRefreshToken } from './../jwtUtils';
import { CookieBuilder } from '../CookieBuilder';
export const loginRoute = () => {
	interface ILoginBody {
		email: string;
		password: string;
	}

	/**
	 * Handles the login request
	 * @param {IRequest} request - The request object
	 * @returns {string | ErrorResponse} - The login status or an error response
	 */
	router.post('/auth/login', async (request: IRequest, env: Env) => {
		try {
			const { email, password }: ILoginBody = await request.json();
			console.log(`Email: ${email} \n Password: ${password}`);
			if (!email) return error(400, { message: 'Email is required' });
			if (!password) return error(400, { message: 'Password is required' });

			// Test Auth user
			if (env.ENVIRONMENT == 'development' && email === 'test' && password === 'test') {
				// Generate access token
				const accessToken = await createAccessToken(email, env.JWT_SECRET_KEY, env.ENVIRONMENT);
				console.log(`Access token: ${accessToken}`);
				if (!accessToken) return error(500, { message: 'Internal server error cannot create access token' });

				// Generate refresh token
				const refreshToken = await createRefreshToken(email, env.JWT_SECRET_KEY, env.ENVIRONMENT);
				console.log(`Refresh token: ${refreshToken}`);
				if (!refreshToken) return error(500, { message: 'Internal server error cannot create refresh token' });

				// Return access token and refresh token
				const response = new Response(JSON.stringify({ email, accessToken }), {
					status: 200,
					statusText: 'USER_LOGGED_IN',
				});
				response.headers.set('Content-Type', 'application/json');
				response.headers.set('Accept', 'application/json');

				const cookie = new CookieBuilder('r_token', refreshToken)
					.setHttpOnly(true)
					.setPath('/')
					.setSameSite('Strict')
					.setSecure(env.ENVIRONMENT === 'development' ? false : true)
					.build(); // Example cookie string
				response.headers.append('Set-Cookie', cookie);
				return response;
			} else {
				return error(401, { message: 'Invalid credentials' });
			}
		} catch (e) {
			console.error('An error occurred:', e);
			return error(500, { message: 'Internal server error' });
		}
	});
};
