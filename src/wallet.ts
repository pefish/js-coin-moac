import '@pefish/js-node-assist'
import EthWalletHelper from '@pefish/js-coin-eth/lib/wallet'
import Chain3 from 'chain3'
import * as utils from 'ethereumjs-util'

declare global {
  namespace NodeJS {
    interface Global {
      logger: any;
    }
  }
}

export default class WalletHelper extends EthWalletHelper {
  [x: string]: any;
  chain3: Chain3

  public constructor() {
    super()
    this.chain3 = new Chain3(new Chain3.providers.HttpProvider(``))
  }

  buildTransaction(privateKey: string, toAddress: string, amount: string, nonce: number, gasPrice: string = null, gasLimit: string = '21000'): object {
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.substring(2, privateKey.length)
    }
    if (!gasPrice) {
      gasPrice = '20000000000'
    }
    const rawTx = {
      chainId: 99,
      nonce: nonce.toString().decimalToHexString_(),
      gasPrice: gasPrice.decimalToHexString_(),
      gasLimit: gasLimit.decimalToHexString_(),
      to: toAddress,
      value: amount.decimalToHexString_(),
    }
    const signedTxHex = this.chain3.signTransaction(rawTx, privateKey)
    return {
      txHex: signedTxHex,
      txId: utils.keccak(signedTxHex).toHexString_(true),
    }
  }

  buildContractTransaction(privateKey, contractAddress, methodName, methodParamTypes, params, nonce: number, gasPrice = null, gasLimit = null) {
    const fromAddress = this.getAddressFromPrivateKey(privateKey)
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.substring(2, privateKey.length)
    }
    if (!gasPrice) {
      gasPrice = '20000000000'
    }
    if (!gasLimit) {
      gasLimit = '900000'
    }
    const contract = this.chain3.mc.contract([
      {
        'constant': false,
        'inputs': [
          {
            'name': '_to',
            'type': 'address'
          },
          {
            'name': '_value',
            'type': 'uint256'
          }
        ],
        'name': 'transfer',
        'outputs': [
          {
            'name': 'success',
            'type': 'bool'
          }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
      },
    ]).at(contractAddress)
    const rawTx = {
      chainId: 99,
      from: fromAddress,
      nonce: nonce.toString().decimalToHexString_(),
      gasPrice: gasPrice.decimalToHexString_(),
      gasLimit: gasLimit.decimalToHexString_(),
      to: contractAddress,
      value: 0x00,
      data: contract.transfer.getData(params[0].toLowerCase(), params[1])
    }

    const signedTxHex = this.chain3.signTransaction(rawTx, privateKey)
    return {
      txHex: signedTxHex,
      txId: utils.keccak(signedTxHex).toHexString_(true),
    }
  }
}

