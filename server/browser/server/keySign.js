#!/usr/bin/env node
'use strict';
/*jslint node: true */

var NodeRSA = require('node-rsa');
var fs = require('fs');

var stringify = require('json-stable-stringify');
var openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp

var cat;
var privKey;
var pubKey;
var privKeyContent;
var pubKeyContent;
var options, encrypted;

openpgp.initWorker({ path:'openpgp.worker.js' }) // set the relative web worker path
openpgp.config.aead_protect = true // activate fast AES-GCM mode (not yet OpenPGP standard)

function readFile(path) {
    return fs.readFileSync(path).toString();    // eslint-disable-line no-sync
}

function sorter(a, b) {
    return a.key < b.key ? 1 : -1;
}

function getMetadataRel(mdata, rel) {
    var i;
    for (i = 0; i < mdata.length; i += 1) {
        if (mdata[i].rel === rel) {
            return mdata[i].val;
        }
    }
    return null;
}

function catRemoveSig(inCat) {
    var i;
    var mdata;
    var outCat = {
        'catalogue-metadata': []
    };

    // copy everything but jws rels across
    mdata = inCat['catalogue-metadata'];
    for (i = 0; i < mdata.length; i += 1) {
        if (mdata[i].rel.indexOf('urn:X-hypercat:rels:jws') !== 0) {
            outCat['catalogue-metadata'].push(mdata[i]);
        }
    }

    // for now, copy entire items, as we only deal with header signing
    outCat.items = inCat.items;

    return outCat;
}




function generateKey() {
    // pub 
    /*
    options = {
        userIds: [{ name:'Jon Smith', email:'jon@example.com' }], // multiple user IDs
        curve: "secp256k1",                                       // ECC curve (curve25519, p256, p384, p521, or secp256k1)
        passphrase: 'super long and hard to guess secret'         // protects the private key
    };
    */
    // Generate Key
    // return openpgp.generateKey(options).then(function(key) {
    // key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    // key.generateKeyPair(256);
    var key = new NodeRSA({b: 512});
    
    var privKeyContent = key.exportKey("private");
    var pubKeyContent = key.exportKey("public");
    
    console.log(privKeyContent);
    console.log(pubKeyContent);
    
    // priv + pub
    try {
        privKey = new NodeRSA(privKeyContent);
    } catch(e) {
        console.error("Failed to read privkey");
        process.exit(1); // eslint-disable-line no-process-exit
    }
    
    try {
        pubKey = new NodeRSA(pubKeyContent);
    } catch(e) {
        console.error("Failed to read pubkey");
        process.exit(1); // eslint-disable-line no-process-exit
    }
    
    console.log('privKey\n' + privKey);
    console.log('pubKey\n'  + pubKey);
    return [privKey, pubKey];
    //});
    
};


// sign
function sign(file, privKey, pubKey) {

        var cat={'catalogue-metadata':[]};
        try {
    
                cat['catalogue-metadata'].push({
                    rel: 'urn:X-hypercat:rels:jws:signature',
                    val: privKey.sign(stringify(cat, sorter)).toString('base64')
                });
                cat['catalogue-metadata'].push({
                    rel: 'urn:X-hypercat:rels:jws:alg',
                    val: 'RS256'
                });
                cat['catalogue-metadata'].push({
                    rel: 'urn:X-hypercat:rels:jws:key',
                    val: pubKey.exportKey('pkcs8-public-pem')
                });
                
                var content=JSON.stringify(cat, null, 2);
                console.log("content" + content);
                return fs.writeFile("test.json", content, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    return console.log("The file was saved!");
                }); 
        } catch(e) {
            console.error('Invalid Hypercat', file, e);
        }
        
}    


// verify
function verify(file) {
    return fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.error('Failed to read', file);
        } else {
            try {
                var cat = JSON.parse(data);
                if (pubKey.verify(stringify(catRemoveSig(cat), sorter), new Buffer(getMetadataRel(cat['catalogue-metadata'], 'urn:X-hypercat:rels:jws:signature'), 'base64'))) {
                    console.log("Verify OK");
                } else {
                    console.log("Verify failed");
                }
                return 
            } catch(e) {
                console.error('Invalid Hypercat', file, e);
            }
        }
    });
    
}


var priv, pub;
var keys=generateKey();
console.log(keys[0] + ',' + keys[1]);
var file='test.json';
sign(file, keys[0], keys[1]);
verify(file);

