mergeInto(LibraryManager.library, {


  ConnectWallet: function () {
   try {
      window.dispatchReactUnityEvent("ConnectWallet");
    } catch (e) {
      console.warn("Failed to dispatch event");
    }
  },

    GetToken: function (address,score) {
   try {
      window.dispatchReactUnityEvent("GetToken",UTF8ToString(address),score);
    } catch (e) {
      console.warn("Failed to dispatch event");
    }
  },

  

});