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

  buildContractTransaction(privateKey, contractAddress, methodName, methodParamTypes, params, nonce: number, gasPrice = null, gasLimit = null, abi: string = null) {
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
    const contract = this.chain3.mc.contract(abi || [
      {
        'constant': true,
        'inputs': [],
        'name': 'name',
        'outputs': [
          {
            'name': '',
            'type': 'string'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_spender',
            'type': 'address'
          },
          {
            'name': '_value',
            'type': 'uint256'
          }
        ],
        'name': 'approve',
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
      {
        'constant': true,
        'inputs': [],
        'name': 'totalSupply',
        'outputs': [
          {
            'name': '',
            'type': 'uint256'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': false,
        'inputs': [
          {
            'name': '_from',
            'type': 'address'
          },
          {
            'name': '_to',
            'type': 'address'
          },
          {
            'name': '_value',
            'type': 'uint256'
          }
        ],
        'name': 'transferFrom',
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
      {
        'constant': true,
        'inputs': [],
        'name': 'decimals',
        'outputs': [
          {
            'name': '',
            'type': 'uint8'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'version',
        'outputs': [
          {
            'name': '',
            'type': 'string'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [
          {
            'name': '_owner',
            'type': 'address'
          }
        ],
        'name': 'balanceOf',
        'outputs': [
          {
            'name': 'balance',
            'type': 'uint256'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'constant': true,
        'inputs': [],
        'name': 'symbol',
        'outputs': [
          {
            'name': '',
            'type': 'string'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
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
      {
        'constant': true,
        'inputs': [
          {
            'name': '_owner',
            'type': 'address'
          },
          {
            'name': '_spender',
            'type': 'address'
          }
        ],
        'name': 'allowance',
        'outputs': [
          {
            'name': 'remaining',
            'type': 'uint256'
          }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
      },
      {
        'inputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'constructor'
      },
      {
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'fallback'
      },
      {
        'anonymous': false,
        'inputs': [
          {
            'indexed': true,
            'name': '_from',
            'type': 'address'
          },
          {
            'indexed': true,
            'name': '_to',
            'type': 'address'
          },
          {
            'indexed': false,
            'name': '_value',
            'type': 'uint256'
          }
        ],
        'name': 'Transfer',
        'type': 'event'
      },
      {
        'anonymous': false,
        'inputs': [
          {
            'indexed': true,
            'name': '_owner',
            'type': 'address'
          },
          {
            'indexed': true,
            'name': '_spender',
            'type': 'address'
          },
          {
            'indexed': false,
            'name': '_value',
            'type': 'uint256'
          }
        ],
        'name': 'Approval',
        'type': 'event'
      }
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

