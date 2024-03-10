import { IRequest } from 'itty-router';
import { router } from './../index';

router.post('/auth/register', (request: IRequest) => {
	return 'register';
});
