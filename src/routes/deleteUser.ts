import { IRequest, error} from 'bitty-router-multiheader';
import { Env, router } from './../index';
import { ILoginBody } from '../types';
import { DELETE_USER } from '../sql_commands';
import { CookieBuilder } from '../CookieBuilder';

export const deleteUserRoute = () => {
	router.delete('/auth/deleteUser', async (request: IRequest, env: Env) => {
		try {
			const { email }: Partial<ILoginBody> = await request.json();
			if (!email) return error(400, { message: 'Email is required' });
			console.log(`User Email To Delete: ${email}`);

			const DB = env.DB;
			await DB.prepare(DELETE_USER).bind(email).all();
			const response = new Response(JSON.stringify({ message: 'User deleted successfully' }), {
				status: 200,
				statusText: 'DELETE_SUCCESSFUL',
			});
			const u_cookie = new CookieBuilder('u_info', '').setExpiresRelative(0, 0, 0, 0).build();
			const r_cookie = new CookieBuilder('r_token', '').setExpiresRelative(0, 0, 0, 0).build();
			response.headers.append('Set-Cookie', r_cookie);
			response.headers.append('Set-Cookie', u_cookie);
			return response;
		} catch (e) {
			return error(500, { message: 'Internal server error' });
		}
	});
};
