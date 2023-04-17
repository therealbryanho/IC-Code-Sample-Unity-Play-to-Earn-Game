using System.Collections.Generic;
using System.Collections;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using System.Runtime.InteropServices;

public class UIManager : MonoBehaviour {

	[Header("GUI Components")]
	public GameObject mainMenuGui;
	public GameObject pauseGui, gameplayGui, gameOverGui;
	public GameObject loginBtn;

	public static string wallet_address;

	public GameState gameState;
	public Text tokens;
	public int currentGameScore;
	public GameObject inputField;
	private string input;

	bool clicked;

	//show game over gui
	public void ShowGameOver()
	{
		mainMenuGui.SetActive(false);
		pauseGui.SetActive(false);
		gameplayGui.SetActive(false);
		gameOverGui.SetActive(true);
		gameState = GameState.GAMEOVER;
		AudioManager.Instance.PlayMusic(AudioManager.Instance.menuMusic);

		checkWallet();
		GetToken();
	}

   [DllImport("__Internal")]
   private static extern void ConnectWallet();

	public void loginButton(){
		ConnectWallet();
	}

   [DllImport("__Internal")]
   private static extern void GetToken(string address, int score);

	public void GetToken(){
		GetToken(wallet_address,currentGameScore);
	}


	public void SetAddress(string text)
    {
        wallet_address = text;
    }

	public void checkWallet(){
		if(wallet_address != null){
			tokens.gameObject.SetActive(true);
			tokens.text = "You have earned " + currentGameScore.ToString() + " GMP tokens! Tokens have been sent to " + wallet_address.ToString();
		} else {
			tokens.gameObject.SetActive(true);
			tokens.text = "Thank you for playing!";
		}
	}

}
