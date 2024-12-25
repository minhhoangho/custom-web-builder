import { AnyObject } from '@common/constants/types';
import crypto from 'crypto';

export class CryptoHelper {
  static getBufferOfEncryptionKey(encryptionKey = ''):Buffer {
    return Buffer.from(encryptionKey, 'hex');
  }

  static aesEncrypt(payload: AnyObject, aes128EncryptionKey: string, algorithm = 'aes-128-ecb'): string {
    const payloadInString = JSON.stringify(payload);
    const key = this.getBufferOfEncryptionKey(aes128EncryptionKey);
    const cipher = crypto.createCipheriv(algorithm, key, null);

    return cipher.update(payloadInString, 'utf8', 'hex') + cipher.final('hex');
  }

  static aesDecrypt(encryptedInHex: string, aes128EncryptionKey: string, algorithm = 'aes-128-ecb') {
    const key = this.getBufferOfEncryptionKey(aes128EncryptionKey);
    const decipher = crypto.createDecipheriv(algorithm, key, null);

    try {
      const decrypted =
        decipher.update(encryptedInHex, 'hex', 'utf8') + decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (e) {
      return false;
    }
  }

  static md5(data: AnyObject): string {
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  }

  static hmac(data: AnyObject, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(data))
      .digest('hex');
  }

  static sha1(str: string): string {
    return crypto.createHash('sha1').update(str).digest('hex');
  }
}
