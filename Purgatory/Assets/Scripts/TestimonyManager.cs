using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;
using UnityEngine.UI;
using System.Text;
using System.IO;

public class TestimonyManager : MonoBehaviour
{

    [SerializeField]
    Text charName;
    [SerializeField]
    Text dialogueText;
    [SerializeField]
    Image textbox;
    [SerializeField]
    Image namebox;

    [SerializeField]
    StateManager sm;

    TextAsset currfile;

    string witness;

    int index = -1;

    List<Testimony> testlog;

    bool inTestimony = false;

    bool characterTalking = false;
    bool acceptingInput = true;
    IEnumerator typingRoutine;

    public string nextDialogue = "";
    public string errorDialogue = "";

    bool highlighting = false;

    struct Testimony
    {
        public bool isContradiction;
        public string proof;
        public string cont;
        public string line;
        public bool alreadyDisplayed;

        public Testimony(string isCon, string proofin, string linein, string contin = "")
        {
            if(isCon == "lie")
            {
                proof = proofin;
                isContradiction = true;
                cont = contin;
            } else
            {
                cont = null;
                proof = null;
                isContradiction = false;
            }

            line = linein;
            alreadyDisplayed = false;
        }
        public void setDisplayed(bool disp)
        {
            alreadyDisplayed = disp;
        }
    }



    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
    }

    public void AdvanceTestimony()
    {
        if (!inTestimony || !acceptingInput) return;

        if (characterTalking) //shows whole line if click mid line
        {
            StopCoroutine(typingRoutine);
            characterTalking = false;
            dialogueText.text = "";
            highlighting = false;
            foreach (char letter in testlog[index].line.ToCharArray())
            {
                if (letter == '@')
                {
                    highlighting = !highlighting;
                    continue;
                }
                if (highlighting) dialogueText.text += "<color=lightblue>" + letter + "</color>";
                else dialogueText.text += "<color=orange>" + letter + "</color>";
            }
            highlighting = false;
            testlog[index].setDisplayed(true);
        }
        else //advance line if line is finished
        {

            ParseLine();

        }
    }

    public void RetreatTestimony()
    {
        if (!inTestimony || !acceptingInput) return;

        testlog[index].setDisplayed(true);
        if (index > 0)
        {
            if (characterTalking)
            {
                StopCoroutine(typingRoutine);
                characterTalking = false;
            }
            index--;
            dialogueText.text = "";
            highlighting = false;
            foreach (char letter in testlog[index].line.ToCharArray())
            {
                if (letter == '@')
                {
                    highlighting = !highlighting;
                    continue;
                }
                if (highlighting) dialogueText.text += "<color=lightblue>" + letter + "</color>";
                else dialogueText.text += "<color=orange>" + letter + "</color>";
            }
            highlighting = false;

        }
    }

    public void ParseLine()
    {
        if (index < testlog.Count - 1) index++;   

        if (!testlog[index].alreadyDisplayed)
        {
            typingRoutine = TypeDialogue(testlog[index].line);
            StartCoroutine(typingRoutine);
        }
        else
        {
            dialogueText.text = "";
            highlighting = false;
            foreach (char letter in testlog[index].line.ToCharArray())
            {
                if (letter == '@')
                {
                    highlighting = !highlighting;
                    continue;
                }
                if (highlighting) dialogueText.text += "<color=lightblue>" + letter + "</color>";
                else dialogueText.text += "<color=orange>" + letter + "</color>";
            }
            highlighting = false;
        }
        
    }

    public void SetInTestimony(bool it)
    {
        inTestimony = it;
    }

    public bool GetInTestimony()
    {
        return inTestimony;
    }

    public void SetEnabled(bool en)
    {
        acceptingInput = en;
    }

    public string GetCurrentProof ()
    {
        Debug.Log(testlog[index].isContradiction + " - " + testlog[index].line + " - " + testlog[index].proof);
        return (testlog[index].proof);
    }

    public string GetCurrentCont()
    {
        Debug.Log(testlog[index].isContradiction + " - " + testlog[index].line + " - " + testlog[index].proof);
        return (testlog[index].cont);
    }


    //animates text so that it appears one letter at a time
    IEnumerator TypeDialogue(string sentence)
    {
        characterTalking = true;
        dialogueText.text = "";
        highlighting = false;
        foreach (char letter in sentence.ToCharArray())
        {
            if(letter == '@')
            {
                highlighting = !highlighting;
                continue;
            }
            if (highlighting) dialogueText.text += "<color=lightblue>" + letter + "</color>";
            else dialogueText.text += "<color=orange>" + letter + "</color>";
            yield return null;
        }
        highlighting = false;
        testlog[index].setDisplayed(true);
        characterTalking = false;
    }

    public void LoadTestimony(string name)
    {
        index = -1;
        acceptingInput = false;

        testlog = new List<Testimony>();
        TextAsset file;
        try
        {
            file = sm.gs.GeneratedAssets[name];
        }
        catch (Exception e)
        {
            file = Resources.Load("Textfiles/" + name) as TextAsset;
        }
        Debug.Log(file.text);

        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        writer.Write(file.text);
        writer.Flush();
        stream.Position = 0;
        var r = new StreamReader(stream, Encoding.UTF8);
        string line;

        witness = r.ReadLine().Split(' ')[0];
        witness = witness.Substring(1, witness.Length-1);

        nextDialogue = r.ReadLine();
        errorDialogue = r.ReadLine();

        string cont = "";

        string[] testimony = file.text.Split('\n');

        for(int i = 3; i < testimony.Length; i++)
        {
            line = testimony[i];
            Debug.Log(line);

            if (line != null && line != "")
            {
                if(line[0] == ';')
                {
                    cont = line.Substring(1, line.Length - 1);
                    continue;
                }
                string[] lineData = line.Split(';');

                if (lineData.Length < 1) continue;

                string isCon = lineData[0];
                string linein = lineData[1];
                string proof = "";
                string contr = "";
                if (lineData.Length > 3)
                {
                    proof = lineData[2];
                    contr = lineData[3];
                }
                else if (cont != "")
                {
                    proof = cont;
                    cont = "";
                }

                Testimony lineEntry = new Testimony(isCon, proof, linein, contr);

                testlog.Add(lineEntry);
            }
        }

        r.Close();

        acceptingInput = true;
        charName.text = witness;

        ParseLine();
    }

}
