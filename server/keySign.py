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
# '\xb1./J\xa883\x974\xa4\xac\x1e\x1b!\xc8\x11'

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
# (2, 'Crypto.PublicKey.DSA')
# (2, 'Crypto.PublicKey.ElGamal')

# You share pubkey with Friend
pubkey = key.publickey()

print (pubkey)
try:
    pkcs1_15.new(key).verify(h, signature)
    print ("The signature is valid.")
except (ValueError, TypeError):
    print ("The signature is not valid.")
# You send message (plaintext) and signature to Friend.
# Friend knows how to compute hash.
# Friend verifies the message came from you this way:

# A different hash should not pass the test.
#pubkey.verify(hash[:-1], signature)
