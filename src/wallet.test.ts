import '@pefish/js-node-assist'
import assert from 'assert'
import EthWalletHelper from './wallet'
import rpl from 'chain3/lib/accounts/rlp'

declare global {
  namespace NodeJS {
    interface Global {
      logger: any;
    }
  }
}

describe('EthWalletHelper', () => {

  let walletHelper

  before(async () => {
    walletHelper = new EthWalletHelper()
  })

  it('buildTransaction', async () => {
    try {
      const result = walletHelper.buildTransaction(
        `0x8b4a73a6a9a07708f5133dc112234fe1ae4136c9878121ba16b923debb30ffad`,
        `0x535dfb7ffc2f4db90564316f4604b51b0cbcf72b`,
        `0.001`.shiftedBy_(18),
        15,
      )
      // global.logger.error('result', result)
      assert.strictEqual(result[`txId`], '0xcce530d6ea3c9219c935ec41e65a7edce52a28522deee4b60eee66f4a66dbde6')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('buildContractTransaction', async () => {
    try {
      const result = walletHelper.buildContractTransaction(
        `0x8b4a73a6a9a07708f5133dc112234fe1ae4136c9878121ba16b923debb30ffad`,
        `0x4c6007cea426e543551f2cb6392e6d6768f74706`,
        'transfer',
        [
          'address',
          'uint256'
        ],
        [
          `0x535dfb7ffc2f4db90564316f4604b51b0cbcf72b`,
          `0.001`.shiftedBy_(18)
        ],
        14,
        `20000000000`,
        `900000`,
      )
      // global.logger.error('result', result)
      assert.strictEqual(result[`txId`], '0x1f4f8895300ea90bb6d415b78a3b835f5f0e789dc1c73bf0699285df6713ce8f')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('deriveAllByXprivPath', async () => {
    try {
      const xpriv = walletHelper.getXprivBySeed('3af29c97ae94a45788c170d052a7d115cd838d51790aa0b68747af1a53b1b241a6d02a502196e6db10ea7cb9d5ffe510bee2a689e915dc8feeb30d3ad1f4cc0c')
      const result = walletHelper.deriveAllByXprivPath(xpriv, `m/44'/60'/0'/0/2/16`)
      // global.logger.error(xpriv, result)
      assert.strictEqual(result['address'], '0xc2ff9108b104f1ab4c780b5ca31422ba20ac1b47')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

  it('decodeTxHex', async () => {
    try {
      const result = rpl.decode('0xf8af81b0808502540be400830249f0944c6007cea426e543551f2cb6392e6d6768f7470680b844a9059cbb00000000000000000000000009bb1dd637cafdcda27579a3786840e39e49659f0000000000000000000000000000000000000000000005150ae84a8cdf000000808081eaa000dbe56b2d9570a955028d0389cd875d9bdd151242c2212a0c5157536e5eac8da01d7b9066ce2c446e9779d768e7ee5532c87fecb431706eed8db2f4ab7c1faefd')
      global.logger.error(result)
      // assert.strictEqual(result['address'], '0xc2ff9108b104f1ab4c780b5ca31422ba20ac1b47')
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {}, err)
    }
  })

})

