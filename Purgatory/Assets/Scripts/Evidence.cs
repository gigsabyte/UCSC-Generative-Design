using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Text;
using System.IO;


public class Evidence : MonoBehaviour
{
    [SerializeField]
    Text descriptionText;

    [SerializeField]
    string desc = "";

    [SerializeField]
    Text name;

    [SerializeField]
    Image visual;

    [SerializeField]
    Sprite test;

    [SerializeField]
    EvidenceDatabase database;

    [SerializeField]
    EvidenceManager manager;

    bool loadedEvidence = false;

    // Start is called before the first frame update
    void OnEnable()
    {
        LoadEvidence();
    }

    public void SetName(string n)
    {
        name.text = n;
    }

    public void SetDescription(string description)
    {
        desc = description;
    }

    public void SetVisual(Sprite spr)
    {
        visual.sprite = spr;
    }

    public void DisplayDescription()
    {
        descriptionText.text = desc;
        manager.setCurrentEvidence(name.text);
    }

    public void LoadEvidence()
    {
        if (loadedEvidence) return;

        TextAsset file = Resources.Load("Textfiles/Evidence/" + gameObject.name) as TextAsset;
        
        string[] lines = file.text.Split('\n');

        try
        {
            
            
            string name = lines[0].Substring(0, lines[0].Length - 1);
            SetName(name);
            Sprite spr = database.getSpriteByName(name);
            SetVisual(spr);
            SetDescription(lines[1]);            

        } catch(System.IndexOutOfRangeException e)
        {
            Debug.Log("oh god we fucked up");
        }

        loadedEvidence = true;
    }
}
