export class CookieBuilder {
	private name: string;
	private value: string;
	private path: string;
	private secure: boolean;
	private httpOnly: boolean;
	private sameSite: string;
	private expires: Date | null;

	constructor(name: string, value: string) {
		this.name = name;
		this.value = value;
		this.path = '/';
		this.secure = false;
		this.httpOnly = true;
		this.sameSite = 'Strict';
		this.expires = null;
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

	setExpiresRelative(days: number = 0, months: number = 0, minutes: number = 0, seconds: number = 0): CookieBuilder {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + days);
		expirationDate.setMonth(expirationDate.getMonth() + months);
		expirationDate.setMinutes(expirationDate.getMinutes() + minutes);
		expirationDate.setSeconds(expirationDate.getSeconds() + seconds);
		this.expires = expirationDate;
		return this;
	}

	setSameSite(sameSite: 'Strict' | 'Lax' | 'None'): CookieBuilder {
		this.sameSite = sameSite;
		return this;
	}

	build(): string {
		const secureAttribute = this.secure ? 'Secure' : '';
		const httpOnlyAttribute = this.httpOnly ? 'HttpOnly' : '';
		let cookie = `${this.name}=${this.value}; Path=${this.path}; ${secureAttribute}; ${httpOnlyAttribute}; SameSite=${this.sameSite}`;
		if (this.expires) {
			const expiresUTC = this.expires.toUTCString();
			cookie += `; Expires=${expiresUTC}`;
		}
		return cookie;
	}
}
