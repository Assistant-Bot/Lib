/**
 * Data structure to hold secrets
 *
 * Items in the store are hashed so if accidently leaked,
 * they are harder to unhash
 */
export default class EnvStore extends Map {
	public salt: number;

	public constructor() {
		super();
		this.salt = (Math.random() * 500);
	}

	public set(k: string, v: string): this {
		return super.set(k, this.hash(v));
	}

	public get(k: string): string {
		return this.unhash(super.get(k));
	}

	public getRaw(k: string): string {
		return super.get(k);
	}

	private hash(v: string): Uint8Array {
		let strBuffer = new TextEncoder().encode(v);
		let buffer = new Uint8Array(strBuffer.length);

		let odd = false;
		// Subtract: false
		// Add: true
		for (let i = 0; i < buffer.length; i++) {
			if (odd) {
				buffer[i] = strBuffer[i] + this.salt;
			} else {
				buffer[i] = strBuffer[i] - this.salt;
			}
			odd = !odd;
		}

		return buffer
	}

	private unhash(v: Uint8Array): string {
		let val = new Uint8Array(v.length);
		let odd = false;
		// Substract: true
		// Add: false
		for (let i = 0; i < v.length; i++) {
			if (odd) {
				val[i] = v[i] - this.salt;
			} else {
				val[i] = v[i] + this.salt;
			}
			odd = !odd
		}
		return (new TextDecoder().decode(val));
	}
}