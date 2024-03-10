import jwt from '@tsndr/cloudflare-worker-jwt';

// Function to create access token
export async function createAccessToken(email: string, secretKey: string, env: string): Promise<string> {
	if (!secretKey) return '';
	if (!env) return '';
	let expire = calculateExpiration(0, 0, 5, 0);
	if (env === 'development') {
		expire = calculateExpiration(0, 0, 1, 0); // Immidiate Expire
	}
	const accessToken = await jwt.sign({ email, exp: expire }, secretKey);
	return accessToken;
}

// Function to create refresh token
export async function createRefreshToken(email: string, secretKey: string, env: string): Promise<string> {
	if (!email) return '';
	if (!secretKey) return '';
	if (!env) return '';
	let expire = calculateExpiration(0, 0, 0, 30);
	if (env === 'development') {
		expire = calculateExpiration(0, 0, 1, 0); // Immidiate Expire
	}
	const refreshToken = await jwt.sign({ email, exp: calculateExpiration(0, 0, 0, 30) }, secretKey);
	return refreshToken;
}

// Function to verify refresh token
export async function verifyRefreshToken(token: string, secretKey: string): Promise<boolean> {
	const decoded = await jwt.verify(token, secretKey);
	return decoded;
}

function calculateExpiration(days = 0, hours = 0, minutes = 0, seconds = 0) {
	// Convert days, hours, minutes, and seconds to seconds
	const totalSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;

	// Calculate expiration time
	const expirationTime = Math.floor(Date.now() / 1000) + totalSeconds;

	return expirationTime;
}
