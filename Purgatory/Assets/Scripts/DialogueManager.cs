using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;
using UnityEngine.UI;
using System.Text;
using System.IO;

public class DialogueManager : MonoBehaviour
{
    public TextAsset script;


    struct ScriptLine
    {
        public string command;
        public string[] arguments;

        public ScriptLine(string commandin, string[] argumentsin)
        {
            command = commandin;
            arguments = argumentsin;
        }
    }

    List<ScriptLine> lines;

    struct SavedDialogue
    {
        public List<ScriptLine> lines;
        public int index;

        public SavedDialogue(List<ScriptLine> linesin, int indexin)
        {
            lines = linesin;
            index = indexin;
        }
    }

    Stack<SavedDialogue> savedDialogues;

    /* other variables */
    

    /* gameobject variables */
    [SerializeField]
    MoveCamera cam;
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

    /* state variables */
    bool inDialogue = true;
    int lineIndex = -1;
    string currDialogue = "";
    bool highlighting = false;
    public bool acceptingInput = true;
    public bool characterTalking = false;
    private IEnumerator typingRoutine;

    public bool waiting = false;

    // Start is called before the first frame update
    void Awake()
    {
        savedDialogues = new Stack<SavedDialogue>();
    }

    void Start()
    {
        
    }


    // Update is called once per frame
    void Update()
    {
        
    }

    public void AdvanceTextbox()
    {
        if (!inDialogue || !acceptingInput || waiting) return;

        if (characterTalking && lineIndex >= 0) //shows whole line if click mid line
        {
            StopCoroutine(typingRoutine);
            characterTalking = false;
            dialogueText.text = "";
            highlighting = false;
            foreach (char letter in lines[lineIndex].arguments[1].ToCharArray())
            {
                if(letter == '@')
                {
                    highlighting = !highlighting;
                    continue;
                }
                if (highlighting) dialogueText.text += "<color=lightblue>" + letter + "</color>";
                else dialogueText.text += letter;
            }
        }
        else //advance line if line is finished
        {
            ParseLine();
        }
    }

    void ParseLine()
    {
        
        if (characterTalking) return;

        lineIndex++;
        Debug.Log(lineIndex);
        ScriptLine line = lines[lineIndex];
        if(line.command == "camera")
        {
            int pos = Int32.Parse(line.arguments[0]);
            cam.MoveToPosition(pos);
            ParseLine();
        }
        else if(line.command == "line")
        {
            charName.text = line.arguments[0];
            typingRoutine = TypeDialogue(line.arguments[1]);
            StartCoroutine(typingRoutine);
        }
        else if(line.command == "wait")
        {
            float time = float.Parse(line.arguments[0]);
            StartCoroutine(KillTime(time));
        }
        else if(line.command == "show")
        {
            ShowUI();
            ParseLine();
        }
        else if(line.command == "hide")
        {
            HideUI();
            ParseLine();
        }
        else if(line.command == "losehealth")
        {
            float amount = float.Parse(line.arguments[0]);
            sm.LoseHealth(amount);
        }
        else if(line.command == "branch")
        {
            SaveScript();
            if(line.arguments[0] == "generated")
            {
                LoadScript(line.arguments[1], true);
            }
            LoadScript(line.arguments[0]);
        }
        else if(line.command == "unbranch")
        {
            ReturnToScript();
        }
        else if(line.command == "testimony")
        {
            cam.MoveToPosition(1);
            Debug.Log(line.arguments[0]);
            sm.BeginTestimony(line.arguments[0]);
        }
        else if(line.command == "end")
        {
            if (sm.testimonyPaused) sm.ResumeTestimony();
            else Destroy(this);
        }
        else
        {
            lineIndex++;
            ParseLine();
        }
    }

    public void HideUI()
    {
        textbox.enabled = false;
        namebox.enabled = false;
        charName.enabled = false;
        dialogueText.enabled = false;
    }

    public void ShowUI()
    {
        textbox.enabled = true;
        namebox.enabled = true;
        charName.enabled = true;
        dialogueText.enabled = true;
    }

    // Kills time
    IEnumerator KillTime(float time)
    {
        waiting = true;
        yield return new WaitForSeconds(time);
        waiting = false;
        ParseLine();
    }

    //animates text so that it appears one letter at a time
    IEnumerator TypeDialogue(string sentence)
    {
        Debug.Log(sentence);
        characterTalking = true;
        dialogueText.text = "";
        foreach (char letter in sentence.ToCharArray())
        {
            if(letter == '@')
            {
                highlighting = !highlighting;
                continue;
            }
            if (highlighting) dialogueText.text += "<color=lightblue>" + letter + "</color>";
            else dialogueText.text += letter;
            yield return null;
        }
        characterTalking = false;
    }

    public void SetEnabled(bool en)
    {
        acceptingInput = en;
    }

    public void SetInDialogue(bool id)
    {
        inDialogue = id;
    }

    public void SaveScript()
    {
        SavedDialogue script = new SavedDialogue(lines, lineIndex);
        savedDialogues.Push(script);
    }

    public void ReturnToScript()
    {
        SavedDialogue script = savedDialogues.Pop();
        lines = script.lines;
        lineIndex = script.index;
        ParseLine();
    }

    public void LoadScript(string name, bool isGenerated = false)
    {
        

        if(isGenerated) script = sm.gs.GeneratedAssets[name];
        else script = Resources.Load("Textfiles/"+name) as TextAsset;

        

        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        try
        {
            writer.Write(script.text);
        } catch(Exception e)
        {
            return;
        }
        lineIndex = -1;
        writer.Flush();
        stream.Position = 0;
        var r = new StreamReader(stream, Encoding.UTF8);

        lines = new List<ScriptLine>();
        string line;
        do
        {
            line = r.ReadLine();
            Debug.Log(line);
            
            if (line != null)
            {
                string[] lineData = line.Split(';');

                if (lineData.Length < 1) continue;

                string command = lineData[0];

                string[] arguments = new string[lineData.Length - 1];

                for(int i = 1; i < lineData.Length; i++)
                {
                    arguments[i - 1] = lineData[i];
                }

                ScriptLine lineEntry = new ScriptLine(command, arguments);

                lines.Add(lineEntry);
            }
        } while (line != null);

        r.Close();
        ParseLine();
    }
}
