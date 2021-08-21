/** Locale modules **/
import crypto from 'crypto';
import config from '../bin/config';

const createHashPasswordUtil = (password: string) => {
    const hashHmac = (stringToHash: string) => crypto.createHmac('sha512', config.credential.secretKey)
        .update(stringToHash)
        .digest('hex');

    const cipher = crypto.createCipheriv(
        'aes-128-cbc',
        Buffer.from(config.credential.ivKey, 'base64'),
        Buffer.from(config.credential.iv, 'base64')
    );
    const cipherUpdate = cipher.update(password);
    const hashCipher = Buffer.concat([cipherUpdate, cipher.final()]).toString('hex');

    return hashHmac(hashCipher);
};

export {
    createHashPasswordUtil,
}
