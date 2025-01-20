const { exec, spawn } = require('child_process');
const fs = require('fs');

const generateCertificateWithExistingKey = () => {
  const opensslCommand = `openssl req -new -key localhost.key -out localhost.csr ; openssl x509 -req -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt`;
  const child = spawn(opensslCommand,[],{stdio:'pipe'});
  child.stdout.on('data', (data) => {
     child.stdin.write('');
    })
}

generateCertificateWithExistingKey();
