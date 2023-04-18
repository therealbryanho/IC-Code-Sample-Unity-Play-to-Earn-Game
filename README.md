# IC Code Sample - Unity Play to Earn Game

- The purpose of this repo is to provide sample code to Unity game developers who may be keen to explore deploying play to earn games on the Internet Computer.
- This repo will share code and explain how a Unity WebGL game can connect with a user's Internet Computer wallet and also trigger the transfer of tokens to the user's wallet at the end of each game.
- Video Explainer https://youtu.be/-7Nlb9U894o
- Game demo canister https://65t4u-siaaa-aaaal-qbx4q-cai.ic0.app/
- Token canister Candid UI for checking your game token balance https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=62s2a-7qaaa-aaaal-qbx4a-cai

# Project Setup and Run in local dfx

- Git clone or download the zip from this repo. Extract the zip file.
- Go into project main folder and open terminal in the terminal type `npm install` to install the necessary dependencies that used in the project.
- Open another terminal window and type `dfx start --clean`. This will start a local dfx server. This step won't be required if you are deploying to mainnet.
- Before you deploy, ensure you follow these [steps](https://github.com/therealbryanho/IC-Code-Sample-Unity-Play-to-Earn-Game/blob/main/README.md#project-folder-do-this-before-deploying) 
- After the dependencies from step 2 are installed, we can deploy locally by typing `dfx deploy`. After successfully deployed, it will display urls for candid UI and react frontend. We can open the react frontend url to play the game. And the token candid UI to query token balance.
- > If you encounter "sh: webpack: command not found" when deploying, run `npm install --save-dev webpack`. For local testing, use NFID wallet because it works with local replica.
- > If deploy fails, it could be because you did not follow these [steps](https://github.com/therealbryanho/IC-Code-Sample-Unity-Play-to-Earn-Game/blob/main/README.md#project-folder-do-this-before-deploying) . You will need to delete canister_ids.json and deploy again.
- > Optional - for the purpose of testing react frontend code easier, you can also open another terminal and run `npm start`. This way, you can change the code and refresh the frontend page without re-deploying and can save some time. When done testing, deploy again using `dfx deploy`.

## Deployment to Mainnet

- Before you deploy, ensure you follow the [steps](https://github.com/therealbryanho/IC-Code-Sample-Unity-Play-to-Earn-Game/blob/main/README.md#project-folder-do-this-before-deploying) 
- To deploy into main net type `dfx deploy --network ic` this allow to deploy in ic main network.

## Project Gameplay Flow

- First when the player clicks login, Unity WebGL will call the `connectWallet` function using jslib. In React we will catch events using addEventLister and will call connect2ic wallet connect function and it will pop up wallet connection.
- After user login we will get player principal and store in react, and then user can start play the game.
- Once the game is finish then, the Unity WebGL will call the `GetToken` function from jslib, and React will catch event using addEventLister and call <b>MotokoGetToken</b> with callBack function because Unity send back data to React. The <b>MotokoGetToken</b> will call Transfer function from the WebGL canister using player principal, owner prinicpal, with score.
- The WebGL canister transfer function will check if owner principal is the same as motoko owner principal, if it's the same then it will call `Token.icrc1_transfer` function and transfer token to the player, else then it will exit without sending any token. And it will popup a message.

## Project folder (do this before deploying)

- <b>token folder</b> is the token Canister. You will need to update the owner principal with your principal ID in line 30.
- <b>webgl folder</b> is the Webgl Canister. You will need to update the owner principal with your principal ID in line 12.
- <b>motoko_play_icrc1_frontend folder </b> is the Frontend Canister.
- You will also need to update the owner principal in <b>webpack.config.js</b> with your principal ID in line 92.

## Project Frontend Structure (motoko_play_icrc1_frontend)

- The default frontend with `dfx new` is basic html and js, so the first step is to add React with reference to this [official docs](https://internetcomputer.org/docs/current/developer-docs/frontend/custom-frontend)
- Next, import files from your <b>Unity WebGL build</b> into frontend assets folder. 
- And then install [react-unity-webgl](https://react-unity-webgl.dev/) so that this React project can work with the Unity WebGL files. We can now use React to add functionaliy in the frontend and bridge communication between the frontend and the Unity game.
- In the WebGL game, when login button is clicked, React will call the "ConnectWallet" function to trigger the connecting of wallet and save the wallet address for the session.
- Here's how Unity WebGL C# will call the jslib function

```
  ConnectWallet: function () {
   try {
      window.dispatchReactUnityEvent("ConnectWallet");
    } catch (e) {
      console.warn("Failed to dispatch event");
    }
  }
```

> For Unity to React [Read Here](https://react-unity-webgl.dev/docs/api/event-system) For More Details.

And then will catch the event from React using ` addEventListener` and call the connect2ic login function using `addEventListener("ConnectWallet", ConnectHandler);`. The <b>Connecthandler</b> function will call [connect2ic](https://connect2ic.github.io/docs/) and it will popup to connect wallet. This is how we can get the wallet principal.

- Once a round of the game is finished, we will send back the principal and score to Unity WebGL using `addEventListener("GetToken", GetTokenHandler);`. GetTokenhandler will have useCallBack function to get data from Unity WebGL to React. For example

```
  const GetTokenHandler = useCallback((address, score) => {
    MotokoGetToken(address, score);
  }, []);
```

> For React to Unity [Read Here](https://react-unity-webgl.dev/docs/api/send-message) To understand more about it.

MotokoGetToken will do the transfer function.

### How Unity WebGL to React Connection Works

- First we are loaded the <b>Unity WebGL</b>file to display Unity content in the React using [react-unity-webgl](https://react-unity-webgl.dev/). For example

```
  const { unityProvider } = useUnityContext({
  loaderUrl: "build/myunityapp.loader.js",
  dataUrl: "build/myunityapp.data",
  frameworkUrl: "build/myunityapp.framework.js",
  codeUrl: "build/myunityapp.wasm",
  });

  return <Unity unityProvider={unityProvider} />;

```

- To interact between <b>Unity WebGL</b> and React content we used `useCallback`,`sendMessage`,`addEventListener`,`removeEventListener`. These all are React compoents except for sendMessage which is used directly to send data from React to Unity WebGL jslib file. For example in the jslib we have this function

```
HelloString: function (str) {
  window.alert(UTF8ToString(str));
}

```

- And from the React we can call `sendMessage('controllerName,'Hellostring','Hello World!')` and it will alert <b>Hello World</b>. The controllerName will come from Unity C#.

### React Hook Definition

> <b>useCallback</b> - In React, useCallback is a hook that allows you to memoize a function and only re-create it if its dependencies have changed. The first argument is the function that you want to memoize, and the second argument is an array of dependencies that will trigger a re-creation of the function if they change. The resulting memoizedCallback can be passed down to child components as a prop, without being recreated on every render, as long as its dependencies remain the same.

```
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

> <b>sendMessage</b> - is a function that is part of the UnityLoader object provided by the react-unity-webgl library. This function allows you to send messages from your React component to the Unity WebGL instance embedded on your web page.

> <b>addEventListener</b> - is a method that allows you to attach an event listener to an element in JavaScript. In the context of React, WebGL, and Unity, addEventListener can be used to listen for events such as clicks, mouse movements, or key presses, and then trigger a function or update the state of the application accordingly.

> <b>removeEventListener</b> - is a built-in method in JavaScript that allows you to remove an event listener that was previously attached to an HTML element. In the context of React, WebGL, and Unity, it can be used to remove event listeners that were added to elements in the DOM.

### Project Backend Structure

- There are three canisters for this project which are frontend canister, webgl canister and token canister,
- First the Token canister will do token functionality such as transfer token, check token amount and so on.
- In the WebGL canister we are going to use <b>icrc1_transfer</b> from the Token canister, so we import the Token canister using `import Token "canister:Token";`, and we just call ` Token.icrc1_transfer` with parameters.
- In WebGL we are checking the frontend caller is the same with owner principal before calling token.ircr1_transfer function, so if the frontend caller is not admin then the function will exit immediately without calling transfer function.
- In WebGL we have getter and setter function for the owner principal, so that we can change principal easily.

### ICRP1 Token

- The token canister uses the [ICRP1 Token standard](https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-1). The ICRC-1 is a standard for Fungible Tokens on the Internet Computer.
- We made some changes to the token code and hard code the token information values so that it is easier to deploy; instead of service class that needs to deploy from terminal using parameters.
- In the `private stable var` we store token information such as owner, token name, fee, amount and so on. This is where you can change the Token information to what you want.

## Project Frontend and Backend Connection

- The `dfx.json` file includes information about canister with mapping path including frontend, webgl, and token canister.
- First the frontend canister will include webgl canister as dependencies because we are going to include webgl canister in the frontend.
- We cannot directly import webgl canister in the React frontend because the webgl canister is written in motoko. So to import webgl canister, first we need to convert motoko to React using `dfx generate` command, this command allow us to generate webgl motoko to js file under declarations folder. We don't need to run the command as dfx generate is part of the process when doing deploy with `dfx deploy`.
- In the frontend we just import the webgl canister from declarations path for example ` import { webgl } from "../../../declarations/webgl";` and we can call all the function from the webgl caister.
- In the webpack.config.js file is like dotenv file, in there we stored owner principal, we can simply use with `process.env.OWENER_PRINCIPAL` and when we call `webgl.transferToken` function it need player principal (we got it from connect2ic), owner principal to check principal is the same or not. If owner principal is the same, the webgl canister will call ` Token.icrc1_transfer` fuction and transfer token to the player.
