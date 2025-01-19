import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';


@Injectable()
export class HelperService {
    constructor(    ) { }

    async verifySignature(publicKey, signature, data) {
        const encoder = new TextEncoder(); const dataArray = encoder.encode(data);

        const isValid = await crypto.subtle.verify({
            name: "SHA256",
        },
            publicKey, signature, dataArray
        );
        return isValid;
    }

}



function pemToArrayBuffer(pem) {
    const b64 = pem
        .replace('/-----BEGIN PUBLIC KEY-----/', "")
        .replace('/-----END PUBLIC KEY-----/', "")
        .replace(/\s/g, "");
    const binaryDer = atob(b64);
    const binaryDerArray = new Uint8Array(binaryDer.length);
    for (let i = 0; i < binaryDer.length; i++) {
        binaryDerArray[i] = binaryDer.charCodeAt(i);
    }
    return binaryDerArray.buffer;
}
