/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import NodeRSA from 'node-rsa';

@Injectable()
export class EncryptionService {
    private readonly symmetricKey = 'Qis/hEvZXLSccI70IdGJ+rCZDD/hQuwk';
    private readonly algorithm = 'aes-256-cbc';
    private readonly serverPrivateKey: NodeRSA;
    public readonly serverPublicKey: NodeRSA;
    
    constructor() {
        let f =fs.readFileSync('private.pem', 'utf8');
        this.serverPrivateKey = new NodeRSA(f);
        this.serverPublicKey = new NodeRSA(fs.readFileSync('public.pem', 'utf8'));
        
        if (!fs.existsSync('private.pem') && !fs.existsSync('public.pem')) {
            const key = new NodeRSA({ b: 2048 });
            const publicKey = key.exportKey('public')
            const privateKey = key.exportKey('private')
            fs.writeFileSync('private.pem', privateKey, 'utf-8')
            fs.writeFileSync('public.pem', publicKey, 'utf-8')
        }
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
        const localKey = new NodeRSA(clientPublicKey)
        return localKey.encrypt(data, 'base64')
    }

    public asymmetricDecrypt(encryptedData: string): string {
        return this.serverPrivateKey.decrypt(encryptedData, 'utf8');
    }
}
