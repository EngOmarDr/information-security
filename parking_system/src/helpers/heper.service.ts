import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';



@Injectable()
export class HelperService {
    constructor(    ) { }

    async verifySignature(publicKey: string, signature: string,data) : Promise<boolean> {
        const verify = crypto.createVerify('SHA256');
        verify.update(JSON.stringify(data));
        verify.end();
        const result = verify.verify(publicKey, signature, 'hex');
        return result;
    }

}

