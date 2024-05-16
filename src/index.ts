import "dotenv/config";
import {
    ENTRYPOINT_ADDRESS_V07,
    UserOperation,
    bundlerActions,
    getSenderAddress,
    signUserOperationHashWithECDSA,
} from "permissionless";
import {
    pimlicoBundlerActions,
    pimlicoPaymasterActions,
} from "permissionless/actions/pimlico";
import {
    Address,
    Hex,
    createClient,
    createPublicClient,
    defineChain,
    encodeFunctionData,
    http,
} from "viem";
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

const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
    "0xf7d5e7cE79308738733f7f4B3c5CD44CB66F7d30";

const ownerPrivateKey = generatePrivateKey();
const owner = privateKeyToAccount(ownerPrivateKey);

console.log("Generated wallet with private key:", ownerPrivateKey);

const factory = SIMPLE_ACCOUNT_FACTORY_ADDRESS;
const factoryData = encodeFunctionData({
    abi: [
        {
            inputs: [
                { name: "owner", type: "address" },
                { name: "salt", type: "uint256" },
            ],
            name: "createAccount",
            outputs: [{ name: "ret", type: "address" }],
            stateMutability: "nonpayable",
            type: "function",
        },
    ],
    args: [owner.address, 0n],
});

console.log("Generated factoryData:", factoryData);

const senderAddress = await getSenderAddress(publicClient, {
    factory,
    factoryData,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
});
console.log("Calculated sender address:", senderAddress);

const to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik
const value = 0n;
const data = "0x68656c6c6f"; // "hello" encoded to utf-8 bytes

const callData = encodeFunctionData({
    abi: [
        {
            inputs: [
                { name: "dest", type: "address" },
                { name: "value", type: "uint256" },
                { name: "func", type: "bytes" },
            ],
            name: "execute",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ],
    args: [to, value, data],
});

console.log("Generated callData:", callData);

const gasPrice = await bundlerClient.getUserOperationGasPrice();

const userOperation = {
    sender: senderAddress,
    nonce: 0n,
    factory: factory as Address,
    factoryData,
    callData,
    maxFeePerGas: gasPrice.fast.maxFeePerGas,
    maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
    // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
    signature:
        "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex,
};

const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
    userOperation,
});

const sponsoredUserOperation: UserOperation<"v0.7"> = {
    ...userOperation,
    ...sponsorUserOperationResult,
};

console.log("Received paymaster sponsor result:", sponsorUserOperationResult);

const signature = await signUserOperationHashWithECDSA({
    account: owner,
    userOperation: sponsoredUserOperation,
    chainId: geoTestnet.id,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
});
sponsoredUserOperation.signature = signature;

console.log("Generated signature:", signature);

const userOperationHash = await bundlerClient.sendUserOperation({
    userOperation: sponsoredUserOperation,
});

console.log("Received User Operation hash:", userOperationHash);

// let's also wait for the userOperation to be included, by continually querying for the receipts
console.log("Querying for receipts...");
const receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: userOperationHash,
});
const txHash = receipt.receipt.transactionHash;

console.log(
    `UserOperation included: https://explorerl2new-geo-test-zc16z3tcvf.t.conduit.xyz/tx/${txHash}`,
);
