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
    public Text name;

    [SerializeField]
    Image visual;

    [SerializeField]
    Sprite test;

    [SerializeField]
    public EvidenceDatabase database;

    [SerializeField]
    EvidenceManager manager;

    public Dictionary<string, string> details = new Dictionary<string, string>();

    bool loadedEvidence = false;

    // Start is called before the first frame update
    void OnEnable()
    {
        //LoadEvidence();

        
        //SetVisual(spr);
    }

    public void SetName(string n)
    {
        name.text = n;
    }

    public void SetDescription(string description)
    {
        bool highlighting = false;
        desc = "";

        foreach (char letter in description.ToCharArray())
        {
            if (letter == '@')
            {
                highlighting = !highlighting;
                continue;
            }
            if (highlighting) desc += "<color=lightblue>" + letter + "</color>";
            else desc += letter;
        }
        highlighting = false;
    }

    public void SetVisual(Sprite spr)
    {
        visual.sprite = spr;
    }

    public void SetVisual(string name)
    {
        Sprite spr = database.getSpriteByName(name);
        visual.sprite = spr;
    }

    public void DisplayDescription()
    {
        descriptionText.text = desc;
        manager.setCurrentEvidence(name.text);
    }

    public bool CheckDetail(string det, string[] set)
    {
        //if (det == name.text) return true;

        List<string> valList = new List<string>(details.Values);
        List<string> keyList = new List<string>(details.Keys);

        for(int i = 0; i < valList.Count; i++)
        {
            string key = keyList[i];
            string val = valList[i];
            Debug.Log("Comparing " + det + " and " + val);
            if (val == det)
            {
                set[0] = key;
                set[1] = val;
                return true;
            }
        }

        return false;
    }

    public void AddDetail(string key, string val)
    {
        if (details.ContainsKey(key)) details[key] = val;
        else details.Add(key, val);
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
