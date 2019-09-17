import '@pefish/js-node-assist';
import { EthWallet } from '@pefish/js-coin-eth';
import Chain3 from 'chain3';
export default class WalletHelper extends EthWallet {
    chain3: Chain3;
    constructor();
    buildTransaction(privateKey: string, toAddress: string, amount: string, nonce: number, gasPrice?: string, gasLimit?: string): any;
    buildContractTransaction(privateKey: string, contractAddress: string, methodName: any, methodParamTypes: any, params: any, nonce: number, gasPrice?: any, gasLimit?: any): any;
}
