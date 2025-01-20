const forge = require('node-forge');
const fs = require('fs');

const public = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMXsFwncABrEZ5sut+p8SkqqYQ3FyfvY
9A1SNS5VHEo2/SYc3AD/TlZ2lKF3JmJRtVYo0m4ecYu1ewTlcw6L+SECAwEAAQ==
-----END PUBLIC KEY-----`;

// Generate a key pair
const keys = forge.pki.rsa.generateKeyPair(512);

// Create a self-signed certificate
const cert = forge.pki.createCertificate();
cert.publicKey =forge.pki.publicKeyFromPem(public);
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

// Set subject and issuer (self-signed, so they are the same)
cert.setSubject([
    { name: 'commonName', value: 'localhost' },
    { name: 'countryName', value: 'US' },
    { name: 'organizationName', value: 'My Organization' },
]);
cert.setIssuer(cert.subject.attributes);

// Sign the certificate with its own private key
cert.sign(keys.privateKey, forge.md.sha256.create());

// Export the certificate and private key
const pemCert = forge.pki.certificateToPem(cert);
const pemKey = forge.pki.privateKeyToPem(keys.privateKey);

// Save to files
fs.writeFileSync('certificate.crt', pemCert);
fs.writeFileSync('private.key', pemKey);

console.log('Self-signed certificate created!');
