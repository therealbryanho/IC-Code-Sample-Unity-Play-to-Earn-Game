import React, { useState, useEffect, useCallback } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { ToastContainer, toast } from "react-toastify";
import { webgl } from "../../../declarations/webgl";

import {
  ConnectButton,
  ConnectDialog,
  useDialog,
  Connect2ICProvider,
  useConnect,
} from "@connect2ic/react";

function App() {
  const [wallet_address, setWallet_address] = useState("");
  const [loading, SetLoading] = useState(false);
  const [score, setScore] = useState("");

  //for wallet
  const { open, close, isOpen } = useDialog();
  const { connect, isConnected, status, principal, activeProvider } =
    useConnect({
      onConnect: () => {},
      onDisconnect: () => {},
    });

  const ConnectHandler = () => {
    open();
  };

  //for unity
  const { unityProvider, sendMessage, addEventListener, removeEventListener } =
    useUnityContext({
      loaderUrl: "motokoBuild.loader.js",
      dataUrl: "motokoBuild.data",
      frameworkUrl: "motokoBuild.framework.js",
      codeUrl: "motokoBuild.wasm",
    });

  //for unity to react
  const GetTokenHandler = useCallback((address, score) => {
    MotokoGetToken(address, score);
  }, []);

  const MotokoGetToken = async (principal, value) => {
    if (!principal) {
      toast.error("You Haven't Login Yet!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    SetLoading(true);
    const anomyousID = await process.env.OWENER_PRINCIPAL;
    const id = toast.loading("Please wait...");
    const res = await webgl.transferToken({
      _from: anomyousID,
      _to: principal,
      amount: value,
    });
    toast.update(id, {
      render: `Token of ${value} Successfully Transfer to ${principal}`,
      type: "success",
      isLoading: false,
      autoClose: 5000,
    });
    await SetLoading(false);
    // await webgl.transferCrypto(anomyousID, principalID, value);
    // alert(`Token of ${value} Successfully Transfer to ${principal}`);
  };

  useEffect(() => {
    addEventListener("GetToken", GetTokenHandler);
    addEventListener("ConnectWallet", ConnectHandler);

    return () => {
      removeEventListener("GetToken", GetTokenHandler);
      addEventListener("ConnectWallet", ConnectHandler);
    };
  }, [addEventListener, removeEventListener, GetTokenHandler, ConnectHandler]);

  //after connected send wallet address to the webgl
  useEffect(() => {
    if (principal) {
      sendMessage("UIManager", "SetAddress", principal.toString());
    }
  }, [principal, connect]);

  // useEffect(()=>{
  //   alert("Wallet is Connected to " +principal)
  // },[principal])

  return (
    <div className="container">
      {loading ? <div className="loader"></div> : ""}
      <ToastContainer />
      <ConnectDialog />
      <Unity
        style={{ width: "100%", height: "100vh" }}
        unityProvider={unityProvider}
      />
    </div>
  );
}

export default App;

// for agent

// const agent = new HttpAgent();
// const actor = await Actor.createActor(idlFactory, {
//   agent:agent,
//   canisterId:canisterID,
//   agentOptions: {
//     identity: ownerID,
//   },
// });
