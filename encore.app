{
	"id": "keplerchat-ysa2",
	"lang": "typescript",
	"build": {
		"worker_pooling": true,
		"docker": {
			"bundle_source": true
		},
		"experiments": [
			"bun-runtime"
		]
	},
	"global_cors": {
		"debug": false,
		"allow_headers": [
			"*"
		],
		"expose_headers": [
			"*"
		],
		"allow_origins_without_credentials": [
			"*"
		],
		"allow_origins_with_credentials": [
			"*"
		]
	}
}