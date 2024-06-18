import "dotenv/config";
import {
	ENTRYPOINT_ADDRESS_V07,
	bundlerActions,
	createSmartAccountClient,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
	pimlicoBundlerActions,
	pimlicoPaymasterActions,
} from "permissionless/actions/pimlico";
import { createClient, createPublicClient, defineChain, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const geoTestnet = defineChain({
	id: 19411,
	name: "Geo Testnet",
	nativeCurrency: {
		name: "testnetETH",
		symbol: "testnetETH",
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: [],
			webSocket: undefined,
		},
	},
});

export const publicClient = createPublicClient({
	transport: http(
		"https://geotest.rpc.pinax.network/v1/88a58d053ea735b3db44cab71cb387caaa6f05feeac31434/",
	),
	chain: geoTestnet,
});

const apiKey = process.env.PIMLICO_API_KEY; // REPLACE THIS
const endpointUrl = `https://api.pimlico.io/v2/geo-testnet/rpc?apikey=${apiKey}`;

const safeAccount = await signerToSafeSmartAccount(publicClient, {
	signer: privateKeyToAccount(generatePrivateKey()),
	entryPoint: ENTRYPOINT_ADDRESS_V07,
	safeVersion: "1.4.1",
});

const bundlerClient = createClient({
	transport: http(endpointUrl),
	chain: geoTestnet,
})
	.extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
	.extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07));

const paymasterClient = createClient({
	transport: http(endpointUrl),
	chain: geoTestnet,
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V07));

const safeClient = createSmartAccountClient({
	chain: geoTestnet,
	account: safeAccount,
	bundlerTransport: http(endpointUrl),
	middleware: {
		gasPrice: async () => {
			return (await bundlerClient.getUserOperationGasPrice()).fast;
		},
		sponsorUserOperation: paymasterClient.sponsorUserOperation,
	},
});

const txHash = await safeClient.sendTransaction({
	to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
	value: 0n,
	data: "0x68656c6c6f",
});

console.log(
	`UserOperation included: https://explorerl2new-geo-test-zc16z3tcvf.t.conduit.xyz/tx/${txHash}`,
);
