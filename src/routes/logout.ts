import { IRequest } from 'itty-router';
import { router } from './../index';

router.get('/auth/logout', (request: IRequest) => {
	return 'logout';
});
