import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';



@Injectable()
export class HelperService {
    constructor(    ) { }

    async verifySignature(publicKey, signature, data) : boolean {
        const verify = crypto.createVerify('SHA256');
        const result = verify.verify(pulicKeyUser, body.signature, 'hex')
        return result;
    }

}

