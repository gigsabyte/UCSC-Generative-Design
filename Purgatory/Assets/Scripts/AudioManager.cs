using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AudioManager : MonoBehaviour
{
    [SerializeField]
    AudioSource[] sources;

    Dictionary<string, AudioSource> dict;

    AudioSource currentSong = null;

    Coroutine currCoroutine = null;

    // Start is called before the first frame update
    void Start()
    {
        dict = new Dictionary<string, AudioSource>();
        sources = GetComponentsInChildren<AudioSource>();
        foreach(AudioSource source in sources)
        {
            dict.Add(source.name, source);
        }
    }

    public void PlaySFX(string name, float pitch = 1)
    {
        string adjname = name + "SFX";
        if (!dict.ContainsKey(adjname))
        {
            Debug.Log(name + " - sfx not found");
            return;
        }
        if (dict[adjname].isPlaying && currCoroutine != null)
        {
            StopCoroutine(currCoroutine);
            currCoroutine = StartCoroutine(FadeSFXOutThenIn(adjname, pitch));
        }
        else
        {
            dict[adjname].pitch = pitch;
            dict[adjname].Play();
        }
    }

    IEnumerator FadeSFXOutThenIn(string adjname, float pitch)
    {
        while(dict[adjname].volume > 0)
        {
            dict[adjname].volume -= 0.4f;
            yield return new WaitForFixedUpdate();
        }
        dict[adjname].Stop();
        dict[adjname].volume = 1;
        dict[adjname].pitch = pitch;
        dict[adjname].Play();
    }

    public void PlayBGM(string name)
    {
        string adjname = name + "BGM";
        if (!dict.ContainsKey(adjname))
        {
            Debug.Log(name + " - sfx not found");
            return;
        }

        if (currentSong) currentSong.Stop();

        dict[adjname].volume = 0.75f;
        dict[adjname].Play();
        currentSong = dict[adjname];
    }

    public void StopCurrentBGM()
    {
        if(currentSong)
        {
            currentSong.Stop();
            currentSong = null;
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
