using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class EvidenceManager : MonoBehaviour
{
    [SerializeField]
    GameObject ep;

    [SerializeField]
    DialogueManager dm;

    [SerializeField]
    TestimonyManager tm;

    [SerializeField]
    StateManager sm;

    [SerializeField]
    GameObject evidencebutton;

    [SerializeField]
    GameObject presentbutton;

    [SerializeField]
    Text currText;

    [SerializeField]
    Text currDesc;

    bool displayEvidence = false;

    public string currentEvidence = "none";

    // Start is called before the first frame update
    void Start()
    {
        ep.SetActive(false);
        presentbutton.SetActive(false);
    }

    // Update is called once per frame
    void Update()
    {
        if(Input.GetKeyDown(KeyCode.E))
        {
            
        }
        if(Input.GetKeyDown(KeyCode.P))
        {
            
        }
    }

    public void setCurrentEvidence(string evidence)
    {
        currentEvidence = evidence;
        currText.text = "Current evidence: " + evidence;
        if (evidence == "")
        {
            presentbutton.SetActive(false);
            currDesc.text = "";
        }
        if (tm.GetInTestimony()) presentbutton.SetActive(true);
    }

    public void toggleEvidence()
    {
        displayEvidence = !displayEvidence;
        dm.SetEnabled(!displayEvidence);
        tm.SetEnabled(!displayEvidence);
        ep.SetActive(displayEvidence);

        if (!tm.GetInTestimony() || !displayEvidence) {
            presentbutton.SetActive(false);
            setCurrentEvidence("");
        }
    }

    public void presentEvidence()
    {
        if (currentEvidence == "none") return;

        if (displayEvidence && tm.GetInTestimony())
        {
            if (tm.IsContradictionWithCurrentTestimony(currentEvidence))
            {
                
                sm.BeginDialogue(tm.nextDialogue, true);
            }
            else
            {
                sm.PauseTestimony(tm.errorDialogue);
            }
        }
        presentbutton.SetActive(false);
        displayEvidence = false;
        dm.SetEnabled(!displayEvidence);
        ep.SetActive(displayEvidence);
    }
}
