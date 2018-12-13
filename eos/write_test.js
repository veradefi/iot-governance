//import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs';

const { Api, JsonRpc, RpcError, JsSignatureProvider } = require('eosjs');
const fetch = require('node-fetch');                            // node only; not needed in browsers
const { TextDecoder, TextEncoder } = require('text-encoding');  // node, IE11 and IE Edge Browsers

//const defaultPrivateKey = "PW5Kk8a8xgE4DtNuLr6ULCgiqVq1M4LN6Af8ZqZcK9DwhZbBC7gZp";
//const defaultPrivateKey = "EOS76DbEXt2Yjdz3DcwdCVSkUySArUVxPc29zK9ShcMELd62w3axe";
const defaultPrivateKey = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3";

const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc('https://iotblock.io/eos', { fetch });

const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
//(async() => {
//try {
  api.transact({
    actions: [{
      account: 'catalogue',
      name: 'addcat',
      authorization: [{
        actor: 'eosio',
        permission: 'active',
      }],
      data: {
	      hrefName: "google.com"
      },
    }]
  }, {
    blocksBehind: 30,
    expireSeconds: 30,
  }).then(function (result) {
    console.log(result);
    api.transact({
      actions: 
      [
        {
          account: 'catalogue',
          name: 'addmeta',
          authorization: [{
            actor: 'eosio',
            permission: 'active',
          }],
          data: {
            hrefName: "google.com",
            rel: "urn:X-hypercat:rels:hasDescription",
            val: "test metadata desc"
          },
        },
        {
          account: 'catalogue',
          name: 'addmeta',
          authorization: [{
            actor: 'eosio',
            permission: 'active',
          }],
          data: {
            hrefName: "gmail.com",
            rel: "urn:X-hypercat:rels:hasDescription",
            val: "gmail metadata desc"
          },
        },
        {
          account: 'catalogue',
          name: 'addgraphnode',
          authorization: [{
            actor: 'eosio',
            permission: 'active',
          }],
          data: {
            hrefName: "google.com",
            hrefName2: "gmail.com",
          },
        }
      ]
    }, {
      blocksBehind: 30,
      expireSeconds: 30,
    }).then(function (result2) {
      console.log(result2);
    }).catch (function (e) {
      console.log('\nCaught exception: ' + e);
      if (e instanceof RpcError)
        console.log(JSON.stringify(e.json, null, 2));
    });    
  }).catch (function (e) {
  console.log('\nCaught exception: ' + e);
  if (e instanceof RpcError)
    console.log(JSON.stringify(e.json, null, 2));
  });

//})();
