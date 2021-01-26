export function isOkay(status: number): boolean {
	return !((status - 200) > 100);
}