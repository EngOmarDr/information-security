/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { constants, privateDecrypt, publicEncrypt } from 'crypto';
import * as fs from 'fs';

@Injectable()
export class EncryptionService {
    private readonly symmetricKey = '12345678901234567890123456789012';
    private readonly algorithm = 'aes-256-cbc';

    public readonly serverPrivateKey: string;
    public readonly serverPublicKey: string;

    constructor() {
        this.serverPrivateKey = fs.readFileSync('private.pem', 'utf8')
        this.serverPublicKey = fs.readFileSync('public.pem', 'utf8')
    }

    // Symmetric encryption (AES)
    public symmetricEncrypt(data: string): string {
        const cipher = crypto.createCipheriv(
            this.algorithm,
            this.symmetricKey,
            Buffer.alloc(16, 0),
        );
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    }

    public symmetricDecrypt(data: string): string {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.symmetricKey,
            Buffer.alloc(16, 0),
        );
        return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    }

    public asymmetricEncrypt(data: string, clientPublicKey: string): string {
        const encryptedData = publicEncrypt(
            {
                key: clientPublicKey,
                padding: constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha1",
            },
            Buffer.from(data)
        );
        return encryptedData.toString("base64");
    }

    public asymmetricDecrypt(encryptedData: string): string {
        const decryptedData = privateDecrypt(
            {
                key: this.serverPrivateKey,
                padding: constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha1",
            },
            Buffer.from(encryptedData, "base64")
        );
        return decryptedData.toString();
    }

    public encryptWithPublicKey(data: string,clientPublicKey: string): string {
        const buffer = Buffer.from(data, 'utf8');
        return crypto.publicEncrypt(clientPublicKey, buffer).toString('base64');
    }

    public decryptWithPrivateKey(encryptedData: string): string {
        const buffer = Buffer.from(encryptedData, 'base64');
        const decrypted = crypto.privateDecrypt(this.serverPrivateKey, buffer);
        return decrypted.toString('utf8');
    }
}
