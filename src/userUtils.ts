export function isEmail(email: string): boolean {
	// Regular expression to match email addresses
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function isStrongPassword(password: string): boolean {
	// Regular expression to match strong passwords
	// Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;':"\\,.<>/?]).{8,}$/;
	return passwordRegex.test(password);
}


export function getHeaders(response:Response) {

	let headers;
	if (response.headers.has('set-cookie')) {
		const cookieArray = response.headers.get('set-cookie')?.split(', ') || [];
		headers = Object.assign(Object.fromEntries(response.headers), {'set-cookie': cookieArray});
	} else {
		headers = Object.fromEntries(response.headers);
	}	
	return headers;
}