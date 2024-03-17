/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export interface Env {
	JWT_SECRET_KEY: string;
	ENVIRONMENT: string;
	DB: D1Database;
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}
import { createCors, error, IRequest, json, Router } from 'itty-router-multiheader/dist';
import { loginRoute } from './routes/login';
import { registerRoute } from './routes/register';
import { refreshRoute } from './routes/refresh';
import { logoutRoute } from './routes/logout';
import { deleteUserRoute } from './routes/deleteUser';
export const router = Router();
const { preflight, corsify } = createCors({
	origins: ['*'],
	headers: {
		'my-funky-header': 'is pretty funky indeed',
		'Access-Control-Allow-Credentials': 'true',
	},
});
loginRoute();
registerRoute();
refreshRoute();
logoutRoute();
deleteUserRoute();

router.all('*', preflight);
router.all('/*', (request: IRequest) => error(404, { message: 'Not found', path: request.params, method: request.method }));
router.all('/auth/*', (request: IRequest) => error(404, { message: 'Not found', path: request.params, method: request.method }));

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return router.handle(request, env, ctx).then(json).catch(error).then(corsify);
	},
};
