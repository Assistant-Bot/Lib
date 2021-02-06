const ErrorCode = {
	UNKNOWN: [4000, "Unknown API error (Try reconnecting)"],
	UNKNOWN_OP: [4001, "Unknown OP sent (Don't send invalid payloads or ops)"],
	DECODE_ERROR: [4002, "Unknown payload sent (Don't send invalid payloads)"],
	NOT_AUTH: [4003, "Payload sent prior to authentication (Authenticate before sending a payload)"],
	AUTH_FAILED: [4004, "Authentication failed (Send a valid token)"],
	ALREADY_AUTH: [4005, "Already authentication (Don't send another identify payload)"],
	INVALID_SEQ: [4007, "Invalid sequence ID (Send a valid sequence ID)"],
	RATE_LIMITED: [4008, "Rate Limited (Don't send payloads that quickly)"], // Probably won't use
	SESSION_TIMEOUT: [4009, "Session timed out (Reconnect to gateway)"],
	INVALID_SHARD: [4010, "Invalid shard (Send a valid shard when identifying)"],
	SHARDING_REQUIRED: [4011, "Sharding required (Identify using sharding)"],
	INVALID_API_VERSION: [4012, "Invalid API version (Use a valid gateway version)"],
	INVALID_INTENTS: [4013, "Invalid intents (Send valid intents bitwise)"],
	DISALLOWED_INTENTS: [4014, "Disallowed intents (Enable or whitelist privledged intents if specified)"],
};

Object.freeze(ErrorCode);

export default ErrorCode;