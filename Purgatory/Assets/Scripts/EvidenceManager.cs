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
    public GameObject evidencebutton;

    [SerializeField]
    GameObject presentbutton;

    [SerializeField]
    Text currText;

    [SerializeField]
    Text currDesc;

    [SerializeField]
    public Evidence[] evidenceList;

    bool displayEvidence = false;

    public string currentEvidence = "none";

    Evidence currev;

    // Start is called before the first frame update
    void Start()
    {
        ep.SetActive(false);
        presentbutton.SetActive(false);
        currev = null;
    }


    public void setCurrentEvidence(string evidence)
    {
        currentEvidence = evidence;
        currText.text = "Current evidence: " + evidence;
        if (evidence == "")
        {
            presentbutton.SetActive(false);
            currDesc.text = "";
            currev = null;
        } else
        {
            for(int i = 0; i < evidenceList.Length; i++)
            {
                if(evidenceList[i].name.text == evidence)
                {
                    currev = evidenceList[i];
                    break;
                }
            }
        }
        if (tm.GetInTestimony()) presentbutton.SetActive(true);
    }

    public void toggleEvidence()
    {
        displayEvidence = !displayEvidence;
        dm.SetEnabled(!displayEvidence);
        tm.SetEnabled(!displayEvidence);
        ep.SetActive(displayEvidence);

        if (!tm.GetInTestimony() || !displayEvidence || !ep.activeSelf) {
            presentbutton.SetActive(false);
            setCurrentEvidence("");
        }
    }

    public void presentEvidence()
    {
        if (currentEvidence == "none") return;

        if (displayEvidence && tm.GetInTestimony())
        {
            string[] set = new string[3];

            if (currev != null && currev.CheckDetail(tm.GetCurrentProof(), set))
            {
                set[2] = tm.GetCurrentCont();
                Debug.Log(set[0] + " " + set[1] + " " + set[2]);
                sm.gs.GenerateObjection(sm.evidence, set);
                sm.BeginDialogue(set[0], true);
            }
            else
            {
                sm.PauseTestimony(tm.errorDialogue);
            }
        }
        presentbutton.SetActive(false);
        displayEvidence = false;
        presentbutton.SetActive(false);
        setCurrentEvidence("");
        dm.SetEnabled(!displayEvidence);
        ep.SetActive(displayEvidence);
    }
}
