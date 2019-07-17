import secp256k1 from 'secp256k1'
import Chain3Utils from 'chain3/lib/utils/utils'
import RLP from 'chain3/lib/accounts/rlp'
import Bytes from 'chain3/lib/accounts/bytes'
import Hash from 'chain3/lib/accounts/hash'

export default class SigUtil {

  static trimLeadingZero (hex) {
    while (hex && hex.startsWith('0x00')) {
      hex = '0x' + hex.slice(4);
    }
    return hex;
  }

  static intToHex (i) {
    var hex = i.toString(16)
    if (hex.length % 2) {
      hex = '0' + hex
    }

    return hex
  }

  static intToBuffer (i) {
    var hex = SigUtil.intToHex(i)
    return new Buffer(hex, 'hex')
  }

  static padToEven (a) {
    if (a.length % 2) a = '0' + a
    return a
  }

  static toBuffer (v) {
    if (!Buffer.isBuffer(v)) {
      if (Array.isArray(v)) {
        v = Buffer.from(v)
      } else if (typeof v === 'string') {
        if (SigUtil.isHexString(v)) {
          v = Buffer.from(SigUtil.padToEven(SigUtil.stripHexPrefix(v)), 'hex')
        } else {
          v = Buffer.from(v)
        }
      } else if (typeof v === 'number') {
        v = SigUtil.intToBuffer(v)
      } else if (v === null || v === undefined) {
        v = Buffer.allocUnsafe(0)
      } else if (v.toArray) {
        // converts a BN to a Buffer
        v = Buffer.from(v.toArray())
      } else {
        throw new Error('invalid type')
      }
    }
    return v
  }

  static isHexPrefixed (str) {
    return str.slice(0, 2) === '0x';
  }

  static isHexString (value, length = null) {
    if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
      return false;
    }

    if (length && value.length !== 2 + 2 * length) {
      return false;
    }

    return true;
  }

  static makeEven (hex) {
    if (hex.length % 2 === 1) {
      hex = hex.replace('0x', '0x0');
    }
    return hex;
  }

  static bufferToHex (buf) {
    buf = SigUtil.toBuffer(buf)
    return '0x' + buf.toString('hex')
  }

  static ecsign(msgHash, privateKeyStr) {

    //Convert the input string to Buffer
    if (typeof msgHash === 'string') {
      if (SigUtil.isHexString(msgHash)) {
        msgHash = Buffer.from(SigUtil.makeEven(SigUtil.stripHexPrefix(msgHash)), 'hex')
      }
    }

    const privateKey = new Buffer(privateKeyStr, 'hex');

    const sig = secp256k1.sign(msgHash, privateKey)

    const ret: any = {}
    ret.r = sig.signature.slice(0, 32)
    ret.s = sig.signature.slice(32, 64)
    ret.v = sig.recovery + 27

    return ret
  }

  static stripHexPrefix (str) {
    if (typeof str !== 'string') {
      return str;
    }
    return SigUtil.isHexPrefixed(str) ? str.slice(2) : str;
  }

  static signTransaction (tx, privateKey) {
    let rawTransaction

    if (tx.chainId < 1) {
      return new Error('"Chain ID" is invalid');
    }

    if (!tx.gas && !tx.gasLimit) {
      return new Error('"gas" is missing');
    }

    if (tx.nonce < 0 ||
      tx.gasLimit < 0 ||
      tx.gasPrice < 0 ||
      tx.chainId < 0) {
      return new Error('Gas, gasPrice, nonce or chainId is lower than 0');
    }


    //Sharding Flag can be 0, 1, 2
    //If input has not sharding flag, set it to 0 as global TX.
    if (tx.shardingFlag == undefined) {
      tx.shardingFlag = 0;
    }

    try {
      //Make sure all the number fields are in HEX format

      const transaction = tx;
      transaction.to = tx.to || '0x'; //Can be zero, for contract creation
      transaction.data = tx.data || '0x'; //can be zero for general TXs
      transaction.value = tx.value || '0x'; //can be zero for contract call
      transaction.chainId = Chain3Utils.numberToHex(tx.chainId);
      transaction.shardingFlag = Chain3Utils.numberToHex(tx.shardingFlag);
      transaction.systemContract = '0x0'; //System contract flag, always = 0
      transaction.via = tx.via || '0x'; //vnode subchain address

      const rlpEncoded = RLP.encode([
        Bytes.fromNat(transaction.nonce),
        Bytes.fromNat(transaction.systemContract),
        Bytes.fromNat(transaction.gasPrice),
        Bytes.fromNat(transaction.gasLimit),
        transaction.to.toLowerCase(),
        Bytes.fromNat(transaction.value),
        transaction.data,
        Bytes.fromNat(transaction.shardingFlag),
        // transaction.via.toLowerCase()]);
        transaction.via.toLowerCase(),
        Bytes.fromNat(transaction.chainId),
        "0x",
        "0x"
      ]);

      const hash = Hash.keccak256(rlpEncoded);

      // for MOAC, keep 9 fields instead of 6
      const vPos = 9;
      //Sign the hash with the private key to produce the
      //V, R, S
      const newsign = SigUtil.ecsign(hash, SigUtil.stripHexPrefix(privateKey));

      const rawTx = RLP.decode(rlpEncoded).slice(0, vPos + 3);

      //Replace the V field with chainID info
      const newV = newsign.v + 8 + transaction.chainId * 2;


      // dont allow uneven r,s,v values
      // there could be 0 when convert the buffer to HEX.
      rawTx[vPos] = SigUtil.trimLeadingZero((SigUtil.makeEven(SigUtil.bufferToHex(newV))));
      rawTx[vPos + 1] = SigUtil.trimLeadingZero((SigUtil.makeEven(SigUtil.bufferToHex(newsign.r))));
      rawTx[vPos + 2] = SigUtil.trimLeadingZero((SigUtil.makeEven(SigUtil.bufferToHex(newsign.s))));

      rawTransaction = RLP.encode(rawTx);


    } catch (e) {

      return e;
    }

    return rawTransaction;
  }
}