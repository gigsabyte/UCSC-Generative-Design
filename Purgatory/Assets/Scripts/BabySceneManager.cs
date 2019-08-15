using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class BabySceneManager : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void GoToGame()
    {
        SceneManager.LoadScene("Game");
    }

    public void GoToTitle()
    {
        SceneManager.LoadScene("Title");
    }
}
