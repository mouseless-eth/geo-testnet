# Permissionless.js Patch Example On Geo Testnet

Example UserOperation sponsorship flow on geo-testnet using a patched version of permissionless.js

## Running Example

Fill out Pimlico Api Key

```
mv .env.example .env
```

Run Example

```
pnpm run start
```

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
