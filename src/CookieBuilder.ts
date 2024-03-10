export class CookieBuilder {
	private name: string;
	private value: string;
	private path: string;
	private secure: boolean;
	private httpOnly: boolean;
	private sameSite: string;

	constructor(name: string, value: string) {
		this.name = name;
		this.value = value;
		this.path = '/';
		this.secure = false;
		this.httpOnly = true;
		this.sameSite = 'Strict';
	}

	setPath(path: string): CookieBuilder {
		this.path = path;
		return this;
	}

	setSecure(secure: boolean): CookieBuilder {
		this.secure = secure;
		return this;
	}

	setHttpOnly(httpOnly: boolean): CookieBuilder {
		this.httpOnly = httpOnly;
		return this;
	}

	setSameSite(sameSite: 'Strict' | 'Lax' | 'None'): CookieBuilder {
		this.sameSite = sameSite;
		return this;
	}

	build(): string {
		const secureAttribute = this.secure ? 'Secure' : '';
		const httpOnlyAttribute = this.httpOnly ? 'HttpOnly' : '';
		const cookie = `${this.name}=${this.value}; Path=${this.path}; ${secureAttribute}; ${httpOnlyAttribute}; SameSite=${this.sameSite}`;
		return cookie;
	}
}
