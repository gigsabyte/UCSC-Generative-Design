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

    struct Testimony
    {
        public bool isContradiction;
        public string proof;
        public string line;
        public bool alreadyDisplayed;

        public Testimony(string isCon, string proofin, string linein)
        {
            if(isCon == "lie")
            {
                proof = proofin;
                isContradiction = true;
            } else
            {
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
            dialogueText.text = testlog[index].line;
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
            dialogueText.text = testlog[index].line;

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
            dialogueText.text = testlog[index].line;
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

    public bool IsContradictionWithCurrentTestimony(string evidence)
    {
        Debug.Log(testlog[index].proof);
        Debug.Log(testlog[index].isContradiction);
        return (testlog[index].isContradiction && testlog[index].proof == evidence);
    }


    //animates text so that it appears one letter at a time
    IEnumerator TypeDialogue(string sentence)
    {
        Debug.Log(sentence);
        characterTalking = true;
        dialogueText.text = "";
        foreach (char letter in sentence.ToCharArray())
        {
            dialogueText.text += letter;
            yield return null;
        }
        testlog[index].setDisplayed(true);
        characterTalking = false;
    }

    public void LoadTestimony(string name)
    {
        index = -1;
        acceptingInput = false;

        testlog = new List<Testimony>();

        TextAsset file = Resources.Load("Textfiles/" + name) as TextAsset;

        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        writer.Write(file.text);
        writer.Flush();
        stream.Position = 0;
        var r = new StreamReader(stream, Encoding.UTF8);
        string line;

        witness = r.ReadLine();

        nextDialogue = r.ReadLine();
        errorDialogue = r.ReadLine();

        do
        {
            line = r.ReadLine();
            Debug.Log(line);

            if (line != null)
            {
                string[] lineData = line.Split(';');

                if (lineData.Length < 1) continue;

                string isCon = lineData[0];
                string linein = lineData[1];
                string proof = "";
                if (lineData.Length > 2) proof = lineData[2];

                Testimony lineEntry = new Testimony(isCon, proof, linein);

                testlog.Add(lineEntry);
            }
        } while (line != null);

        r.Close();

        acceptingInput = true;
        charName.text = witness;

        ParseLine();
    }

}
