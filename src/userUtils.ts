

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


export async function generateSalt(): Promise<string> {
	const saltArray = new Uint8Array(16);
	await crypto.getRandomValues(saltArray);
	return Array.from(saltArray).map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
  }
  
export async function hashPassword(password: string, salt: string): Promise<string> {
	const encoder = new TextEncoder();
	const passwordBuffer = encoder.encode(password);
	const saltBuffer = encoder.encode(salt);
	const combinedBuffer = new Uint8Array([...passwordBuffer, ...saltBuffer]);
	const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(byte => ('0' + byte.toString(16)).slice(-2)).join('');
  }