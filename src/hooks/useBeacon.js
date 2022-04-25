import { useCallback, useState, useEffect } from "react";
import constate from "constate";

import { BeaconWallet } from "@taquito/beacon-wallet";
import { MichelCodecPacker, TezosToolkit } from "@taquito/taquito";

// TESTNET
export const contractAddress = "KT1QwVmmYNp3Ke2JkNr2eaAdYyAJFusbi7yH";

const DEFAULT_NETWORK = {
  id: "ithacanet",
  nextNetworkIndex: 1,
  name: "Ithacanet",
  type: "testnet",
  rpcBaseURL: "https://ithacanet.smartpy.io",
};

// MAINNET
// const contractAddress = "KT1N5HyBD5HZ7NZwmDar1LmBN7WkHbdr6zb9";

// const DEFAULT_NETWORK = {
//   id: "mainnet",
//   nextNetworkIndex: 1,
//   name: "Mainnet",
//   type: "main",
//   rpcBaseURL: "https://mainnet.smartpy.io",
// };

class LambdaViewSigner {
  async publicKeyHash() {
    const acc = await wallet.client.getActiveAccount();
    if (!acc) throw new Error("Not connected");
    return acc.address;
  }
  async publicKey() {
    const acc = await wallet.client.getActiveAccount();
    if (!acc) throw new Error("Not connected");
    return acc.publicKey;
  }
  async secretKey() {
    throw new Error("Secret key cannot be exposed");
  }
  async sign() {
    throw new Error("Cannot sign");
  }
}

const options = {
  name: "FA2 deployer",
  iconUrl: "https://tezostaquito.io/img/favicon.png",
};

const michelEncoder = new MichelCodecPacker();

const Tezos = new TezosToolkit(DEFAULT_NETWORK.rpcBaseURL);
const wallet = new BeaconWallet(options, { forcePermission: true });
Tezos.setWalletProvider(wallet);
Tezos.setSignerProvider(new LambdaViewSigner());
Tezos.setPackerProvider(michelEncoder);

export const [UseBeaconProvider, useBeacon] = constate(() => {
  const [pkh, setUserPkh] = useState();
  const [contract, setContract] = useState(null);
  const [storage, setStorage] = useState(null);

  const connect = useCallback(async () => {
    await wallet.disconnect();
    await wallet.clearActiveAccount();
    await wallet.requestPermissions({
      network: { type: DEFAULT_NETWORK.id },
    });
    Tezos.setWalletProvider(wallet);
    Tezos.setRpcProvider(DEFAULT_NETWORK.rpcBaseURL);
    const activeAcc = await wallet.client.getActiveAccount();
    if (!activeAcc) {
      throw new Error("Not connected");
    }
    setUserPkh(await wallet.getPKH());
  }, []);

  const disconnect = useCallback(async () => {
    await wallet.disconnect();
    await wallet.clearActiveAccount();
    Tezos.setWalletProvider(wallet);
    setUserPkh(undefined);
  }, []);

  const loadContract = useCallback(async () => {
    const contract = await Tezos.contract.at(contractAddress);
    setContract(contract);
    const storage = await contract.storage();
    setStorage(storage);
  }, []);

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  return {
    connect,
    disconnect,
    isConnected: !!pkh,
    Tezos,
    wallet,
    pkh,
    contract,
    storage,
  };
});

export default useBeacon;
