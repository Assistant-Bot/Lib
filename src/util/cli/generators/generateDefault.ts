/**	
 * Default code generation for Assistant	
 * @param name 	
 * @param token 	
 */	
export default async function generateDefault(name: string, token: string,) {	
	await Deno.mkdir('src');	
	const base64 = 'aW1wb3J0IHsgQ2xpZW50LCBDb21tYW5kSGFuZGxlciwgTWVzc2FnZSwgSW50ZW50cyB9IGZyb20gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9Bc3Npc3RhbnQtQm90L0xpYi9tYXN0ZXIvbW9kLnRzJwoJCmNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoe2ludGVudHM6IEludGVudHMuYWxsKCkucGFyc2UoKX0pOwpjb25zdCBjb21tYW5kSGFuZGxlciA9IG5ldyBDb21tYW5kSGFuZGxlcihjbGllbnQsIHtwcmVmaXg6ICIhIn0pOwoKY2xpZW50Lm9uKCdyZWFkeScsICgpID0+IHsKCWNvbnNvbGUubG9nKCJSZWFkeSIsIGNsaWVudC51c2VyLnRhZyk7Cn0pOwoKY2xpZW50Lm9uKCdtZXNzYWdlJywgKG1zZzogTWVzc2FnZSkgPT4gewoJaWYobXNnLmNvbnRlbnQgPT09ICchcGluZycpIHsKCQltc2cucmVwbHkoIioqUG9uZyEqKiIpOwoJfQoJCgkvLy8gcmV0dXJuIGF3YWl0IGNvbW1hbmRIYW5kbGVyLnByb2Nlc3NNZXNzYWdlKG1zZyk7Cn0pOwoKY2xpZW50LmNvbm5lY3QoSlNPTi5wYXJzZShuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUoRGVuby5yZWFkRmlsZVN5bmMoRGVuby5jd2QoKSArICcvY29uZmlnLmpzb24nKSkpLnRva2VuKQ=='	
	Deno.writeTextFile('src/mod.ts', atob(base64));	

	Deno.writeTextFile('./config.json', JSON.stringify({	
		name,	
		token	
	}));
} 