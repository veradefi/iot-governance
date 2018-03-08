from Crypto.Signature import pkcs1_15
import Crypto.Hash.MD5 as MD5
import Crypto.PublicKey.RSA as RSA
import Crypto.PublicKey.DSA as DSA
import Crypto.PublicKey.ElGamal as ElGamal
import Crypto.Util.number as CUN
from Crypto.Hash import SHA256
import os

plaintext = 'The rain in Spain falls mainly on the Plain'

# Here is a hash of the message
hash = MD5.new(plaintext).digest()
print(repr(hash))

# Generates a fresh public/private key pair
key = RSA.generate(1024, os.urandom)

message = 'To be signed'

#key = RSA.importKey(open('private_key.der').read())
h = SHA256.new(message)
signature = pkcs1_15.new(key).sign(h)
K = ''

# You sign the hash
#signature = key.sign(hash, K)
print(len(signature), RSA.__name__)
# (1, 'Crypto.PublicKey.RSA')

# You share pubkey with Friend
'''
cat['catalogue-metadata'].push({
        'rel': 'urn:X-hypercat:rels:jws:signature',
        'val': privKey.sign(stringify(cat, sorter)).toString('base64')
});
cat['catalogue-metadata'].push({
        rel: 'urn:X-hypercat:rels:jws:alg',
        val: 'RS256'
});
cat['catalogue-metadata'].push({
        rel: 'urn:X-hypercat:rels:jws:key',
        val: pubKey.exportKey('pkcs8-public-pem')
});
'''
pubkey = key.publickey().exportKey('PEM')
privkey = key.exportKey('PEM')

print (pubkey, privkey)
try:
    pkcs1_15.new(key).verify(h, signature)
    print ("The signature is valid.")
except (ValueError, TypeError):
    print ("The signature is not valid.")
