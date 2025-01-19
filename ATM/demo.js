const NodeRSA = require('node-rsa')
const crypto = require('crypto');

function encrypt(data, sessionKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-ctr',
        Buffer.from(sessionKey, 'hex'),
        iv,
    );
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(encryptedData, sessionKey) {
    const [ivHex, encryptedHex] = encryptedData.split(':');

    // تحقق من أن IV موجود وبالطول الصحيح
    if (!ivHex || Buffer.from(ivHex, 'hex').length !== 16) {
        throw new BadRequestException('Invalid or missing initialization vector (IV).');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
        'aes-256-ctr',
        Buffer.from(sessionKey, 'hex'),
        iv,
    );

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedHex, 'hex')),
        decipher.final(),
    ]);
    return decrypted.toString();
}


const sessionKey = 'b3e7c5b94db8a8f4cbb7a21d8b83d8f3e58c63e8e29b7b6a02f5d7b8e3d7a4f1';
const EncrptedData = '00bd4384eb9d8c8e5e2fbd74dcb51009:ffcd1518d5d0ac15abd12e8894661107f081904c63200a259651178e49621add2d097e48235878215720e55d5f5bcd9f3b64bad7b290917a25c28d94bb7fd6f9363c33cbd5448f1bb88448d1d6fd88ef';
const data = JSON.stringify({
    slotNumber: 1,
    time: '2025-01-08T12:00:00Z',
    reservedBy: 'user123',
});

// const encryptedData = encrypt(data, sessionKey);
// const encryptedData = decrypt(EncrptedData, sessionKey);
// console.log(encryptedData);

// const key = new NodeRSA({ b: 512 });
// console.log(key.exportKey('public'));
// console.log(key.exportKey('private'));

const pulicKeyServer = `-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANH1eXM9VIrl7PQG5m47l4Hgdx4iPOjb\nQWV/67/4kS2o1oKgXuYXqo34fTJszsRCVP+virQOA0xx6p51ucoOBgkCAwEAAQ==\n-----END PUBLIC KEY-----`;

const privateKeyServer = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAwIXiotvG8rIeTvMLJjYkiJzoeDLKS9tZ/fJk7GrCdqdriAa3
n+b+MF+5EPbe8qk9bHIMekktRuQIvH9A6Iu3HtVQ1lPR99DmvfVUKSfljkdMkMza
/rTqNgcTwkze//HMu/adItYaVzAXlw6v7x9RKKDGSJ6ZmlDWaXA2pwQfv3Pp8FT4
JSC7nIiQrY4bKc4tqbnxdvcdJu6PlNGMTvDfXrAR29m006CGt1HuuiQGo5Grd1s8
IfRiFnE+0/IfLq07c1lo9qaHuxzPNw8ORD+Je0TM+IP/QzAwLsdGfJXHJ1rwdUkt
x7dlCqVH0v2p1jdYW6s/ru2ambzLTVIa1XnQFwIDAQABAoIBAQCa6N/khQz+6X1j
r0JwW65n0kFnvg5ynSw7HthANuMEUFBA4o7L9jTfvZYO5WWdQbov0VDi8JCi8wdo
jMgwlYMiJyhlXIqdaZTQkl9Gwlh+dDZSaNNpkS7HjEhE1k+1B93h/FyR1E7bitHg
dSvxL3TBSSRi+GLF/XeY3XbMSpA1HmsNt5C42JzcP1vM05Npcud1fMRyfHtvPu/V
F/nja4Az2Sl05NSP08o/hxr/JktONcAU9GA4KZ4og6zn00RMAzJPwe9AltTKgaXA
OOW3sCsrsvJXGTb6HJMHpu7HQVGH5st0VT5YvwdvXa+I30CJTXo6Foujr0MzyO4f
4vTH5BRxAoGBAPmQr0LsD4ZiR86YBDEzCVdjrSxOG9omxT50lhV3AjFu5NxL6d4s
oW3u9D4xpqHOR5dD1sboVT+JGaJcFgNaLlfFDo0pMVpTdK4gUjBVjBhZdg/QfbXA
JNR6XVFt84Oto54B1WvQZK/ESz2um+/97XfTq3R6ruJguCW5oxLdkgV/AoGBAMV8
rg+EbxfkQHnxdkfUEPzHXef50zVP1YLCeHj/PQ88lTHpSkJG0IVerbr9JANG0KI5
rjs1n0dv49Dwi6H2aaTVM4H5eq9/gCog+RqI8/c3zunZFdiOqekFuXqmtv+xnuCQ
s/AJZ6F4hh2MXAyETF1siGAsL8/CAENzahyBF/FpAoGAA5hB7gTYdGcWAbPO26aQ
i+GzrN+zJwFH9g5X2xdLwMqIIWQ2iiy6Zor6maq9a7c88MDZZyQRlkizRdNtvb6e
zETaYM4nF9X76EYu6ONSkUc4nCG0rdmGrkjU70dWKp9lq/D60gK+cImzS8AoHtzZ
ftBdt9/MhRY/kMuLvcnTQKECgYA+zTRpGNtfRKXAYaoUk3rHd/sD7y1cUcP7Li6z
g69+LezgD2kfBHgBQaeLxD50kEt+m0st5xJ83DcdVbGB0uOrmGUl2xlJwAkY3J16
87xpjKTPNsq8sDmWMczXFTcyvuBgV4PxPHxpG/PCZ8VJ8bR7LS19L/AQaIg+6u/+
morrqQKBgQDzBAJF06EaxfYnRSA77un6CQpIjq6n9ke2o//pn6auMrXrCepn6OR8
soCnsGjI0uqD3MNqNOdiO6QjnDf5Ee4gJOGKe+e3U0g7WhKQ3p7SSV1A7pn4ZwGS
C+VenA1d1GXBDOUHvlBKjDK8SVu5c50Az3XlIPpjBFQ2q9eimV6khA==
-----END RSA PRIVATE KEY-----`;

const pulicKeyUser = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMXsFwncABrEZ5sut+p8SkqqYQ3FyfvY
9A1SNS5VHEo2/SYc3AD/TlZ2lKF3JmJRtVYo0m4ecYu1ewTlcw6L+SECAwEAAQ==
-----END PUBLIC KEY-----`;

const privateKeyUser = `-----BEGIN RSA PRIVATE KEY-----
MIIBPAIBAAJBANH1eXM9VIrl7PQG5m47l4Hgdx4iPOjbQWV/67/4kS2o1oKgXuYX
qo34fTJszsRCVP+virQOA0xx6p51ucoOBgkCAwEAAQJAOG0dZ8Aq0W17ohWcpjFz
xV7bBIk1D2ulhq67YAtgkQFbJP9CzZngKSeD7CKZZEByPfRq+G5HQLeCVlUlf+Tb
AQIhAPuW0kKH769I94MudNhYtYH+3+RO5Q0Xv/fMQsntWy2pAiEA1aPPCz92qVKG
m5LwZZktS316+Me3YKTGmgBxAK2dkWECIQDUb7O27eWbUrd8kzuierU4wSf4Ng3+
kjFMYbN7oeo9kQIhAMM2Rz3T462chvspLRjo+oZ8Rh2FAH8CkaauuJMSEWSBAiEA
md2CQw1BuwPNt3MOuRdmz7NgdxkJGcmjx/8bRMSOl1Y=
-----END RSA PRIVATE KEY-----`;




const Nosecret = '43c70d0e0cc19f45278066f22358c36178d41a69b646cdf2fd532876500eed3e';
const secret = 'SLD/lbh3p3apLAVOtQJL7TTnub4ccJ4bpYTV3S1pPkIYaSnT74FqwXXg45tyytx5iDZrBA+DeW4+0VoFZKvGVEpZwGehU5dNVrqSw+Iu22H2Q3sc3HoNaaYGVSasfSGzH9mAc0rP0D3ORsNDrrubyMw8hU8kc1+uy+qRjpVmSB2AHtpqmloX4uYEB0oNnZRN8cBgyVBBYuOqJqW/sioHW9t+tPyrP6Ft4DiqUyHNUpmY815lgNB8r8i1apE6gVHD';

var encPu = new NodeRSA(pulicKeyServer)
var dec = new NodeRSA(privateKeyUser)

const res = encPu.encrypt(Nosecret, 'base64')
// const res = dec.decrypt(secret,'utf8')

console.log(res);

// const symmetricKey = crypto.randomBytes(32);

// console.log('Symmetric Key:', symmetricKey.toString('hex'));
