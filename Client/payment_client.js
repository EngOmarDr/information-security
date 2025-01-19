const crypto = require('crypto');
const axios = require('axios'); // To send HTTP requests

// Replace this with your actual private key
const privateKey = `
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxi3/uWPjbQtG2
N3Dc//dGXdSNKo+/caq0alI0zO58eAHVvy02942uO9URBnMoIJV0KF9BprGO1vCM
GI38YkTodh69dWa3E5S6Y16c5j7y0QnY3FtJKhiCmqzSs5qZikOQyio4tNxf+dqI
xKtdMVNX0b3cWR5GE5yIGsb8rmX5EUzjkkuxdFNewfXtJ2dPFZuIMxXpDeoe/PI0
yESoOh+CD4YwCGuAQ7dIUATbs4gXQWIIYZs9VBlKQcNMbGw6jm1NNP7cmAI9IUlL
vd9uAj9iOUHSDniDYjUW1miu5NT+D1gbHIIRBwSw1rD012uO4QsOd8Yh6piL6cQw
Ef89mpdZAgMBAAECggEAMt31Vrvt/J/dxpeGwgKh/WqXoaROj/qIfm0xxUfrkgSt
/efqk+OEF6Wzy09uQdJoD2IbvIr+Nx70xyan02XyOSnSb9SJi61UALzEmC5NXbMv
X47upn0ljZG0Lx/fDNt0tTB+vUVwGB1VE7dJI4ekybXhcBamWkx3HfWSCkYLGDr2
X0XpwyFdc97pTt69scyCPGQJtXyw5RDF52CrC/gYI9qGBeZ5CtD6MmQVZLo9Fslz
hnKwkPY6nYSRpEcW9xnmEtbJlzTlqGrKTPIGjsNmiWkuNOjh113sltKfBtGiZjKX
B1So49hbUPv3dOIBi7WO16RhTBmfUzWynJT3YDD/MwKBgQDsLdNIRp/Az3X9ObpP
WkXDvyXwTeRp0Qlh1UFfnbzHHU5Jl/i8WOH/ccaGjJGePvbHs1GGcWErmTXkQKmz
nh+iK/qn7YT6/mozyqbO6h3yhqALhJ3jM/dRtTFQiUmD1PfJjzUzAR/jFesRIoV6
4UxGWSWDs8axuXFGI3X+3LRtOwKBgQDAcfQlEojQTiJ1y+DP0yIKzi5L+NYYrp8Y
M1FHnsWTus+RWedUAZS8kiNSmdMsI+KLHjeEf51W77Z8W5y4PYcl+iXSP0wdsG5I
LcnQWW+WqxshJ6NcIePINJMbMecGJe+V4fkLMtD7BB+xj8CU4IDAvPCSfx2hiT+l
yCwQ/wyUewKBgQC0rXns2NptzkgdKIR3IEAut5R2eaA7s0bSKSqR00IPsUOq2S/Y
Jsb9fDS7yd28ib6Ql4XOq/4CNHsd2rn4Rwc8MRjYTsRknyzv4iAqOsAeQQ8+wH1o
yuBxCYRocB5lVA8biwrPshSKzMG/ogErOB/50Uj5sBZY79zQI2CpUH5W8QKBgHnh
McCw5lkWwxhbkPvOOcciIYwYAnALV9MZ3SZA1dzj+UWS7MD1Z1+uJhTQOz+/UmDN
OFgAAoPmuWo1EyJURV21+XIYiHpdHNs1tJTxr4x6vWnYEsvs4rgPJAObLTdlm0EP
poyDGHuBdxkbc9pV/PUUNEBzpS6DH/48sjvpa+w1AoGBAMYtxcv1eqZ5YJ+CvDfA
+IxfL+E0Vonm4xsAsvNehVw3iEd0MtOcgSRmCwOAgLCuH4tnOTl6DsTlfZL6BNtR
E+kazEOECChvz3cWfDBw3qQp8SNNAh8hDDdNzibDR4iFuZtj1I4gBfZy1FedQ6Pu
KbR+cIq9/h96SO0acgmimlo3
-----END PRIVATE KEY-----
`;
// Data to be sent to the server
const data = {
  userId: 123,
  amount: 1000,
  currency: 'USD',
};

// Create a signature
function signData(data, privateKey) {
  const sign = crypto.createSign('SHA256');
  sign.update(JSON.stringify(data)); // Use the stringified version of the data
  sign.end();

  // Sign the data using the private key
  const signature = sign.sign(privateKey, 'hex');
  return signature;
}

// Send the signed data to the server
async function sendDataToServer(data, privateKey) {
  const signature = signData(data, privateKey);

  try {
    // Prepare the payload
    const payload = {
        "id": 1,
        "encData": "your-encrypted-payment-data"
    };

    // Send the data to the server
    const response = await axios.post('http://localhost:3000/payment/process', payload);

    console.log('Server Response:', response.data);
  } catch (error) {
    console.error('Error sending data to the server:', error.message);
  }
}

// Execute the function
sendDataToServer(data, privateKey);
