# Permissionless.js patch example on geo-testnet

Example UserOperation sponsorship flow on geo-testnet using a patched version of permissionless.js

## Using The Patch In Another NPM Project
- Copy `patches/permissionless@0.1.29.patch` to the root of your npm project.

- Add the following to the project's package.json

```
"pnpm": {
	"patchedDependencies": {
		"permissionless@0.1.29": "patches/permissionless@0.1.29.patch"
	}
}
```

- Run `pnpm install`
