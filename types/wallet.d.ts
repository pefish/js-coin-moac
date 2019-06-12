import '@pefish/js-node-assist';
import EthWalletHelper from '@pefish/js-coin-eth/lib/wallet';
import Chain3 from 'chain3';
declare global {
    namespace NodeJS {
        interface Global {
            logger: any;
        }
    }
}
export default class WalletHelper extends EthWalletHelper {
    [x: string]: any;
    chain3: Chain3;
    constructor();
    buildTransaction(privateKey: string, toAddress: string, amount: string, nonce: number, gasPrice?: string, gasLimit?: string): object;
    buildContractTransaction(privateKey: any, contractAddress: any, methodName: any, methodParamTypes: any, params: any, nonce: number, gasPrice?: any, gasLimit?: any, abi?: string): {
        txHex: any;
        txId: string;
    };
}
