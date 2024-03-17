import { IRequest, error } from 'itty-router-multiheader/dist';
import { Env, router } from './../index';
import type { ILoginBody } from './../types';
import { CookieBuilder } from '../CookieBuilder';
import { createAccessToken, createRefreshToken } from '../jwtUtils';
import { CREATE_USER, CREATE_USER_TABLE, GET_USER } from '../sql_commands';
import { isEmail, isStrongPassword } from '../userUtils';

export const registerRoute = () => {
	router.post('/auth/register', async (request: IRequest, env: Env) => {
		try {
			const { email, password }: ILoginBody = await request.json();
			console.log(`Email: ${email} \n Password: ${password}`);
			if (!email) return error(400, { message: 'Email is required' });
			if (!isEmail(email)) return error(400, { message: 'The Provided Email is not a valid email' });
			if (!password) return error(400, { message: 'Password is required' });
			if (!isStrongPassword(password))
				return error(400, {
					message:
						'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character',
				});
			const DB = env.DB;

			// Create User Table if Not Exist
			await DB.prepare(CREATE_USER_TABLE).all();

			// Check if user already exists
			const user = (await DB.prepare(GET_USER).bind(email).all()).results.pop();
			console.log(`User: ${JSON.stringify(user)}`);
			if (user) {
				return error(400, {
					message: 'User already exists',
					redirect: request.url.replace('register', 'login'),
				});
			}
			// Create User
			const createdUser = (await DB.prepare(CREATE_USER).bind(email, password, null, null, null, null).all()).results.pop();
			if (!createdUser) return error(500, { message: 'Internal server error cannot create user' });
			console.log(`Created user: ${createdUser}`);

			// Test Auth user
			if (env.ENVIRONMENT == 'development' && email && password) {
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
					statusText: 'USER_REGISTERED',
				});
				response.headers.set('Content-Type', 'application/json');
				response.headers.set('Accept', 'application/json');

				const r_cookie = new CookieBuilder('r_token', refreshToken)
					.setHttpOnly(true)
					.setPath('/')
					.setSameSite('Strict')
					.setSecure(env.ENVIRONMENT === 'development' ? false : true)
					.setExpiresRelative(0, 0, 1, 0)
					.build(); // Example cookie string
				const u_cookie = new CookieBuilder('u_info', JSON.stringify({ email }))
					.setHttpOnly(true)
					.setPath('/')
					.setSameSite('Strict')
					.setSecure(env.ENVIRONMENT === 'development' ? false : true)
					.setExpiresRelative(0, 0, 1, 0)
					.build();
				console.info(`Sending Cookie:~ ${r_cookie}`);
				response.headers.append('Set-Cookie', r_cookie);
				response.headers.append('Set-Cookie', u_cookie);
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
