export default class SigUtil {
    static trimLeadingZero(hex: any): any;
    static intToHex(i: any): any;
    static intToBuffer(i: any): Buffer;
    static padToEven(a: any): any;
    static toBuffer(v: any): any;
    static isHexPrefixed(str: any): boolean;
    static isHexString(value: any, length?: any): boolean;
    static makeEven(hex: any): any;
    static bufferToHex(buf: any): string;
    static ecsign(msgHash: any, privateKeyStr: any): any;
    static stripHexPrefix(str: any): any;
    static signTransaction(tx: any, privateKey: any): any;
}
