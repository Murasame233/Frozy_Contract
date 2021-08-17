import algosdk, {
  makeApplicationCloseOutTxn,
  makeApplicationNoOpTxn,
  makeApplicationOptInTxn,
  makeApplicationUpdateTxn,
  makeAssetTransferTxnWithSuggestedParams,
  makePaymentTxnWithSuggestedParams,
} from "algosdk";
import { createApp, updateApp, newApp, deleteApp } from "../utils/axios";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ASID = 17980219;

const server = "https://testnet-algorand.api.purestake.io/ps2";
const port = "";
const token = {
  "X-API-Key": "p141AV1f2m2BdWXw4p05k69qCt1UCc4h6pBKQarW",
};
const algodclient = new algosdk.Algodv2(token, server, port);

const AlgoSigner = window.AlgoSigner;
export async function algoDetect() {
  await AlgoSigner.connect();
}

export function getallvalue(obj) {
  return Object.values(obj);
}

export function get_ALL(resolve) {
  algoDetect().then(() => {
    AlgoSigner.accounts({ ledger: "TestNet" }).then(resolve);
  });
}

export function get_Assets(address, call) {
  AlgoSigner.indexer({
    ledger: "TestNet",
    path: "/v2/accounts/" + address,
  }).then((v) => {
    var called = false;
    v.account.assets &&
      v.account.assets.forEach((e) => {
        if (e["asset-id"] === ASID) {
          call(e.amount);
          called = true;
        }
      });
    if (!called) {
      call(0);
    }
  });
}

function get_program(tran) {
  return [
    Buffer.from(getallvalue(tran.appApprovalProgram)).toString("base64"),
    Buffer.from(getallvalue(tran.appClearProgram)).toString("base64"),
  ];
}

var handleArgsForAlgosigner = (appArgs) => {
  return appArgs.map((v) => Buffer.from(getallvalue(v)).toString("base64"));
};

var AlgoSignerSignedTxnToSDKRaw = (txn) => {
  return AlgoSigner.encoding.base64ToMsgpack(txn.blob);
};

async function sign_two(trans, issign) {
  let binaryTxs = [trans[0].toByte(), trans[1].toByte()];
  let base64Txs = binaryTxs.map((binary) =>
    AlgoSigner.encoding.msgpackToBase64(binary)
  );
  var txs = [
    {
      txn: base64Txs[0],
    },
    {
      txn: base64Txs[1],
    },
  ];
  if (!issign[0]) {
    txs[0].signers = [];
  }
  if (!issign[1]) {
    txs[1].signers = [];
  }
  return await AlgoSigner.signTxn(txs);
}

export async function getaccount(address) {
  await algoDetect();
  let p = new Promise((resolve) => {
    AlgoSigner.algod({
      ledger: "TestNet",
      path: "/v2/accounts/" + address,
    }).then((re) => {
      resolve(re);
    });
  });
  return p;
}

export var handleapps = async (apps) => {
  var handlev = (value) => {
    if (value.type == 2) {
      return value.uint;
    } else {
      return atob(value.bytes);
    }
  };
  var re = [];
  apps.map((app) => {
    var item = { id: app.id };
    app["params"]["global-state"].map((v) => {
      var key = atob(v.key);
      if (key !== "Creator") {
        if (key!== "Escrow"){
        item[key] = handlev(v.value);
        }else{
          item[key] = v.value.bytes;
        }
      }
      return 0;
    });
    if (
      item.hasOwnProperty("EndDate") &&
      item.hasOwnProperty("Goal") &&
      item.hasOwnProperty("Total")
    ) {
      re.push(item);
    }
    return 0;
  });
  return re;
};

export function getTxId(transaction) {
  algoDetect();
  let p = new Promise((resolve) => {
    AlgoSigner.algod({
      ledger: "TestNet",
      path: "/v2/transactions/pending/" + transaction,
    }).then((re) => {
      console.log(re);
      resolve(re["application-index"]);
    });
  });
  return p;
}

export async function signandsend(tran, call) {
  await algoDetect();
  let base64Tx = AlgoSigner.encoding.msgpackToBase64(
    Uint8Array.from(getallvalue(tran))
  );
  AlgoSigner.signTxn([
    {
      txn: base64Tx,
    },
  ])
    .then((signedTxs) => {
      let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(
        signedTxs[0].blob
      );
      let base64Tx = AlgoSigner.encoding.msgpackToBase64(binarySignedTx);
      AlgoSigner.send({ ledger: "TestNet", tx: base64Tx })
        .then(call)
        .catch(console.log);
    })
    .catch(console.log);
}

export var CreateApp = async (account, day, amount, finish) => {
  await AlgoSigner.connect();
  return createApp(account, day, amount).then(async (re) => {
    let data = re.data;
    var appArgs = handleArgsForAlgosigner(data.appArgs);
    let [appApprovalProgram, appClearProgram] = get_program(data);
    let params = await AlgoSigner.algod({
      ledger: "TestNet",
      path: "/v2/transactions/params",
    });
    let sugparams = {
      fee: params["fee"],
      firstRound: params["last-round"],
      lastRound: params["last-round"] + 1000,
      genesisID: params["genesis-id"],
      genesisHash: params["genesis-hash"],
    };
    let signedCreateTxn = await AlgoSigner.sign({
      from: data.address,
      fee: params["fee"],
      type: "appl",
      appOnComplete: 0,
      appIndex: 0,
      firstRound: params["last-round"],
      lastRound: params["last-round"] + 1000,
      genesisID: params["genesis-id"],
      genesisHash: params["genesis-hash"],
      appApprovalProgram: appApprovalProgram,
      appClearProgram: appClearProgram,
      appArgs,
      appLocalInts: data.localInts,
      appLocalByteSlices: data.localBytes,
      appGlobalInts: data.globalInts,
      appGlobalByteSlices: data.globalBytes,
    });
    var createTxnID = (
      await AlgoSigner.send({ ledger: "TestNet", tx: signedCreateTxn.blob })
    ).txId;
    await sleep(10000);
    return await getTxId(createTxnID).then(async (appid) => {
      updateApp(account, appid).then(async (update) => {
        let esdata = update.data;
        let escrow = esdata.approval.result;
        let esaddre = esdata.approval.hash;
        let lsig = algosdk.makeLogicSig(
          Uint8Array.from(Buffer.from(escrow, "base64"))
        );
        var decodedAddr = algosdk.decodeAddress(lsig.address());
        var appArgs = [decodedAddr.publicKey];
        var ApprovalProgram = Uint8Array.from(Buffer.from(appApprovalProgram,"base64"))
        var ClearProgram = Uint8Array.from(Buffer.from(appClearProgram,"base64"))
        let up_txn = makeApplicationUpdateTxn(
          account,sugparams,appid,ApprovalProgram,ClearProgram,appArgs
        );
        let binaryTx = up_txn.toByte();
        let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
        let updateSignedTxn = await AlgoSigner.signTxn([
          {
            txn: base64Tx,
          },
        ]);
        let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(updateSignedTxn[0].blob);
        await algodclient.sendRawTransaction(binarySignedTx).do();
        appArgs = [Uint8Array.from(Buffer.from("Opt"))];
        var AppOptTran = makeApplicationNoOpTxn(
          account,
          sugparams,
          appid,
          appArgs
        );
        var tx2 = makePaymentTxnWithSuggestedParams(
          account,
          esaddre,
          500000,
          undefined,
          undefined,
          sugparams
        );
        var group = algosdk.assignGroupID([AppOptTran, tx2]);
        var signed = await sign_two(group, [true, true]);
        var signedTx1Binary = AlgoSignerSignedTxnToSDKRaw(signed[0]);
        var signedTx2Binary = AlgoSignerSignedTxnToSDKRaw(signed[1]);
        await algodclient
          .sendRawTransaction([signedTx1Binary, signedTx2Binary])
          .do();
        AppOptTran = makeApplicationNoOpTxn(account, sugparams, appid, appArgs);
        tx2 = makeAssetTransferTxnWithSuggestedParams(
          esaddre,
          esaddre,
          undefined,
          undefined,
          0,
          undefined,
          ASID,
          sugparams
        );
        group = algosdk.assignGroupID([AppOptTran, tx2]);
        signed = await sign_two(group, [true, false]);
        signedTx1Binary = AlgoSignerSignedTxnToSDKRaw(signed[0]);
        signedTx2Binary = algosdk.signLogicSigTransaction(tx2, lsig);
        await algodclient
          .sendRawTransaction([signedTx1Binary, signedTx2Binary.blob])
          .do()
          .then(() => finish());
      });
      newApp(appid);
      return appid;
    });
  });
};

export var getApp = async (appid) => {
  return await algodclient.getApplicationByID(appid).do();
};

export var DeleteApp = async (account, id) => {
  let params = await AlgoSigner.algod({
    ledger: "TestNet",
    path: "/v2/transactions/params",
  });
  let signedDeleteTxn = await AlgoSigner.sign({
    from: account,
    fee: params["fee"],
    type: "appl",
    appOnComplete: 5,
    appIndex: id,
    firstRound: params["last-round"],
    lastRound: params["last-round"] + 1000,
    genesisID: params["genesis-id"],
    genesisHash: params["genesis-hash"],
  });
  return await AlgoSigner.send({
    ledger: "TestNet",
    tx: signedDeleteTxn.blob,
  }).then(() => deleteApp(id));
};

export var donateApp = async (account, app, amount) => {
  await algoDetect();
  
  var to = algosdk.encodeAddress(Uint8Array.from(Buffer.from(app.Escrow,"base64")));
  let params = await AlgoSigner.algod({
    ledger: "TestNet",
    path: "/v2/transactions/params",
  });
  let sugparams = {
    fee: params["fee"],
    firstRound: params["last-round"],
    lastRound: params["last-round"] + 1000,
    genesisID: params["genesis-id"],
    genesisHash: params["genesis-hash"],
  };
  let optin = makeApplicationOptInTxn(account,sugparams,app.id);
  let binaryoptTx = optin.toByte();
  let base64optTx = AlgoSigner.encoding.msgpackToBase64(binaryoptTx);
  let signedoptTxs = await AlgoSigner.signTxn([
    {
      txn: base64optTx,
    },
  ]);
  let binarySignedoptTx = AlgoSigner.encoding.base64ToMsgpack(signedoptTxs[0].blob);
  await algodclient.sendRawTransaction(binarySignedoptTx).do();
  var appArgs = [Uint8Array.from(Buffer.from("donate"))];
  let apptran = makeApplicationNoOpTxn(
    account,
    sugparams,
    app.id,
    appArgs
  );
  console.log(to);
  let tx2 = makeAssetTransferTxnWithSuggestedParams(
    account,
    to,
    undefined,
    undefined,
    amount,
    undefined,
    ASID,
    sugparams
  );
  var group = algosdk.assignGroupID([apptran, tx2]);
  var signed = await sign_two(group, [true, true]);
  var signedTx1Binary = AlgoSignerSignedTxnToSDKRaw(signed[0]);
  var signedTx2Binary = AlgoSignerSignedTxnToSDKRaw(signed[1]);
  await algodclient
    .sendRawTransaction([signedTx1Binary, signedTx2Binary])
    .do();
  let closeout = makeApplicationCloseOutTxn(
    account,sugparams,app.id,undefined
  )
  let binaryTx = closeout.toByte();
  let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
  let signedTxs = await AlgoSigner.signTxn([
    {
      txn: base64Tx,
    },
  ]);
  let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
  await algodclient.sendRawTransaction(binarySignedTx).do();
};


export var claimApp = async (account, app) => {
  await algoDetect();
  var from = algosdk.encodeAddress(Uint8Array.from(Buffer.from(app.Escrow,"base64")));
  let params = await AlgoSigner.algod({
    ledger: "TestNet",
    path: "/v2/transactions/params",
  });
  let sugparams = {
    fee: params["fee"],
    firstRound: params["last-round"],
    lastRound: params["last-round"] + 1000,
    genesisID: params["genesis-id"],
    genesisHash: params["genesis-hash"],
  };
  try{
  let optin = makeApplicationOptInTxn(account,sugparams,app.id);
  let binaryoptTx = optin.toByte();
  let base64optTx = AlgoSigner.encoding.msgpackToBase64(binaryoptTx);
  let signedoptTxs = await AlgoSigner.signTxn([
    {
      txn: base64optTx,
    },
  ]);
  let binarySignedoptTx = AlgoSigner.encoding.base64ToMsgpack(signedoptTxs[0].blob);
  await algodclient.sendRawTransaction(binarySignedoptTx).do();
  } catch(e){
console.log(e);
  }
  let escrow = (await updateApp(account,app.id)).data.approval
  let lsig = algosdk.makeLogicSig(
    Uint8Array.from(Buffer.from(escrow.result, "base64"))
  );

  var appArgs = [Uint8Array.from(Buffer.from("claim"))];
  let apptran = makeApplicationNoOpTxn(
    account,
    sugparams,
    app.id,
    appArgs
  );
  let tx2 = makeAssetTransferTxnWithSuggestedParams(
    from,
    account,
    account,
    undefined,
    app.Total,
    undefined,
    ASID,
    sugparams
  );
  var group = algosdk.assignGroupID([apptran, tx2]);
  var signed = await sign_two(group, [true, false]);
  
  var signedTx1Binary = AlgoSignerSignedTxnToSDKRaw(signed[0]);
  var signedTx2Binary = algosdk.signLogicSigTransaction(tx2, lsig);
  console.log(signedTx2Binary.txID)
  await algodclient
    .sendRawTransaction([signedTx1Binary, signedTx2Binary.blob])
    .do();
  let closeout = makeApplicationCloseOutTxn(
    account,sugparams,app.id,undefined
  )
  let binaryTx = closeout.toByte();
  let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
  let signedTxs = await AlgoSigner.signTxn([
    {
      txn: base64Tx,
    },
  ]);
  let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
  await algodclient.sendRawTransaction(binarySignedTx).do();
};