// import algosdk
const algosdk = require("algosdk");
const fs = require("fs");
const path = require("path");
// API server address and API token
const server = "https://testnet-algorand.api.purestake.io/ps2";
const port = "";
require("dotenv").config();
const token = {
  "X-API-Key": process.env.API,
};
const original = process.env.ORIGINAL;
const key = algosdk.mnemonicToSecretKey(process.env.KEY);
const ASID = 17980219;
const algodclient = new algosdk.Algodv2(token, server, port);

class transactor {
  escrowdata;
  approval;
  clear;
  constructor() {
    this.escrowdata = fs.readFileSync(path.join(__dirname, "escrow.teal"));
    algodclient
      .compile(fs.readFileSync(path.join(__dirname, "approval.teal")))
      .do()
      .then(
        (v) => (this.approval = new Uint8Array(Buffer.from(v.result, "base64")))
      )
      .catch((e) => console.log(e));
    algodclient
      .compile(fs.readFileSync(path.join(__dirname, "clear.teal")))
      .do()
      .then(
        (v) => (this.clear = new Uint8Array(Buffer.from(v.result, "base64")))
      )
      .catch(console.log);
    this.get_Txn.bind(this);
  }
  GiveAwayAssets = (addre) => {
    var p = new Promise(function (resole) {
      algodclient
        .getTransactionParams()
        .do()
        .then((params) => {
          var txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            original,
            addre,
            undefined,
            undefined,
            100,
            new Uint8Array("Send you 100"),
            ASID,
            params
          );
          let signed = algosdk.signTransaction(txn, key.sk);
          algodclient
            .sendRawTransaction(signed.blob)
            .do()
            .then(console.log)
            .catch(console.log);
        })
        .catch(console.log);
    }).catch(console.log);
    return p;
  };
  Optin = (addre) => {
    var p = new Promise(function (resolve) {
      algodclient
        .getTransactionParams()
        .do()
        .then((params) => {
          var txn = algosdk
            .makeAssetTransferTxnWithSuggestedParams(
              addre,
              addre,
              undefined,
              undefined,
              0,
              new Uint8Array("Now Use It"),
              ASID,
              params
            )
            .toByte();
          resolve(txn);
        })
        .catch(console.log);
    }).catch(console.log);
    return p;
  };
  get_Txn(addre, end, amount) {
    var p = new Promise((resolve) => {
          const localInts = 1;
          const localBytes = 0;
          const globalInts = 4;
          const globalBytes = 2;
          let appArgs = [];
          var currentTime = Number(new Date());
          appArgs.push(algosdk.encodeUint64(currentTime));
          appArgs.push(algosdk.encodeUint64(currentTime + Number(end)));
          appArgs.push(algosdk.encodeUint64(Number(amount)));
          resolve({
            address: addre,
            appIndex: 100,
            appApprovalProgram: this.approval,
            appClearProgram: this.clear,
            appArgs: appArgs,
            localInts,
            localBytes,
            globalInts,
            globalBytes,
          });
    });
    return p;
  }
  getNewEscrow = (id) => {
    return Buffer.from(this.escrowdata.toString().replace("15987743", id));
  };
  UpdateApp = (appid) => {
    var p = new Promise((resolve) => {
      
      algodclient
        .compile(this.getNewEscrow(appid))
        .do()
        .then((v) => {
          resolve({ appIndex:appid,approval:v, clear: this.clear });
        }).catch(console.log)
        .catch((e) => console.log(e));
    });
    return p
  };
}

module.exports = {
  transactor,
};
