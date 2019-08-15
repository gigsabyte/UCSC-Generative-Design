using System.Collections;
using System;
using System.Collections.Generic;
using UnityEngine;

public class StateManager : MonoBehaviour
{
    [SerializeField]
    public GrammarSystem gs;

    [SerializeField]
    DialogueManager dm;

    [SerializeField]
    TestimonyManager tm;

    [SerializeField]
    GameObject arrows;

    [SerializeField]
    MoveCamera cam;

    [SerializeField]
    GameObject objection;

    [SerializeField]
    GameObject fade;

    [SerializeField]
    GameObject underfade;

    [SerializeField]
    GameObject healthbox;
    [SerializeField]
    GameObject healthbar;

    [SerializeField]
    public EvidenceManager em;

    [SerializeField]
    public AudioManager am;

    [SerializeField]
    public SpriteRenderer w1;

    [SerializeField]
    public SpriteRenderer w2;

    public bool testimonyPaused = false;

    public float health = 128;

    public Dictionary<string, string> evidence;

    public int witind = 0;
    public int witcont = 0;
    public int testind = 1;

    // Start is called before the first frame update
    void Start()
    {
        em.evidencebutton.SetActive(false);
        gs.ParseProductionRules("Narratives/False");
        evidence = gs.GenerateNarrative("Narratives/False");
        
        gs.GenerateEvidence(em.evidenceList, evidence);
        gs.GenerateTransition(evidence, "Witness1Intro", "");
        gs.GenerateTransition(evidence, "Witness2Intro", "");
        gs.GenerateConfession(evidence, "True");


        FirstDialogue("test");
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void SetWitnessSprites(int w1s, int w2s)
    {
        Debug.Log(em.evidenceList[4].name.text.Substring(0, 1));
        w1.sprite = em.evidenceList[4].database.getSpriteByName("" + w1s);
        w2.sprite = em.evidenceList[4].database.getSpriteByName("" + w2s);//em.evidenceList[4]
    }

    public void SwapWitnesses()
    {
        w1.gameObject.SetActive(false);
        w2.gameObject.SetActive(true);
    }

    public void Advance()
    {
        witcont++;
        testind++;
        if (witind == 0)
        {
            if (witcont < 2)
            {
                gs.GenerateTransition(evidence, "retry", "test-imony");
                BeginDialogue("retry", false);
            } else
            {
                witind++;
                testind = 1;
                am.StopCurrentBGM();
                gs.GenerateTransition(evidence, "GoToWitness2", "test-imony");
                BeginDialogue("GoToWitness2", false);
            }
        }
        else
        {
            if (witcont < 5)
            {
                gs.GenerateTransition(evidence, "retry " + (testind - 1), "test-imony");
                BeginDialogue("retry " + (testind - 1), false);
            }
            else
            {
                gs.GenerateTransition(evidence, "GoToConfession", "test-imony");
                am.StopCurrentBGM();
                BeginDialogue("GoToConfession", false);
            }
        }
    }

    public void BeginTestimony(string name)
    {
        dm.SetInDialogue(false);
        StartCoroutine(Transition(ContBeginTestimony, name));
        Debug.Log("T" + (witind + witcont));
        Debug.Log(evidence.ContainsKey("material"));
        gs.GenerateTestimony("T" + (witcont), "False", evidence, 1);
    }

    public void ContBeginTestimony(string name)
    {
        am.PlayBGM("Testimony" + (testind));
        tm.LoadTestimony("T" + (witcont));
        tm.SetInTestimony(true);
        arrows.SetActive(true);
    }

    public void FirstDialogue(string name)
    {
        tm.SetInTestimony(false);
        arrows.SetActive(false);
        underfade.SetActive(true);
        ContBeginDialogue(name);
    }

    public void BeginDialogue(string name, bool obj, bool fadeout = true)
    {
        tm.SetInTestimony(false);
        arrows.SetActive(false);
        if(obj)
        {
            StartCoroutine(MakeObjection(ContBeginDialogue, name));
        } else
        {
            StartCoroutine(Transition(ContBeginDialogue, name, fadeout));
        }
        
    }

    public void ContBeginDialogue(string name)
    {
        dm.LoadScript(name);
        dm.SetInDialogue(true);
    }

    public void PauseTestimony(string name)
    {
        tm.SetInTestimony(false);
        arrows.SetActive(false);
        am.StopCurrentBGM();
        StartCoroutine(MakeObjection(ContPauseTestimony, name));
    }

    void ContPauseTestimony(string name)
    {
        dm.LoadScript(name);
        dm.SetInDialogue(true);
        testimonyPaused = true;
    }

    public void ResumeTestimony()
    {
        am.PlayBGM("Testimony" + (witcont + 1));
        dm.SetInDialogue(false);
        StartCoroutine(Transition(ContResumeTestimony));
    }

    void ContResumeTestimony()
    {
        tm.SetInTestimony(true);
        arrows.SetActive(true);
        tm.SetEnabled(true);
        tm.ParseLine();
        testimonyPaused = false;
        cam.MoveToPosition(1);
    }

    public void LoseHealth(float amount)
    {
        StartCoroutine(LoseHealthAnim(amount));
        
    }

    public IEnumerator LoseHealthAnim(float amount)
    {
        dm.waiting = true;
        healthbox.GetComponent<Animator>().Play("SlideIn");
        yield return new WaitForSeconds(0.25f);
        float lose = 1;

        for(float i = 0; i < amount && health >0; i++)
        {
            health -= lose;

            healthbar.GetComponent<RectTransform>().sizeDelta = new Vector2(health, 20);
            yield return null;

        }
        yield return new WaitForSeconds(0.25f);
        healthbox.GetComponent<Animator>().Play("SlideOut");
        yield return new WaitForSeconds(0.25f);
        if (health <= 0)
        {
            BeginDialogue("Gameover", false);
        }
        dm.waiting = false;
    }

    public IEnumerator MakeObjection(Action returnFunc)
    {
        objection.SetActive(true);
        am.PlaySFX("Objection");

        objection.GetComponent<Animator>().Play("Shake");
        yield return new WaitForSeconds(0.6f);

        objection.SetActive(false);

        returnFunc();
    }

    public IEnumerator MakeObjection(Action<string> returnFunc, string name)
    {
        objection.SetActive(true);
        am.PlaySFX("Objection");

        objection.GetComponent<Animator>().Play("Shake");
        yield return new WaitForSeconds(0.6f);

        objection.SetActive(false);
        if(witcont - witind == 1)
        {
            am.PlayBGM("Pursuit");
        } else
        {
            am.PlayBGM("Objection");
        }

        returnFunc(name);
    }

    public IEnumerator Transition(Action returnFunc)
    {
        fade.SetActive(true);
        fade.GetComponent<Animator>().Play("FadeOut");
        yield return new WaitForSeconds(0.625f);
        returnFunc();
        fade.GetComponent<Animator>().Play("FadeIn");
        yield return new WaitForSeconds(0.625f);
        fade.SetActive(false);
        
    }

    public IEnumerator FadeIn()
    {
        underfade.GetComponent<Animator>().Play("FadeIn");
        yield return new WaitForSeconds(0.65f);
        underfade.SetActive(false);
    }

    public IEnumerator FadeOut()
    {
        underfade.SetActive(true);
        underfade.GetComponent<Animator>().Play("FadeOut");
        yield return new WaitForSeconds(0.65f);
        dm.gameObject.GetComponent<BabySceneManager>().GoToGame();
    }

    public IEnumerator Transition(Action<string> returnFunc, string name, bool fadeout = true)
    {
        fade.SetActive(true);
        if (fadeout)
        {
            fade.GetComponent<Animator>().Play("FadeOut");
            yield return new WaitForSeconds(0.625f);
        }
        returnFunc(name);
        fade.GetComponent<Animator>().Play("FadeIn");
        yield return new WaitForSeconds(0.65f);
        fade.SetActive(false);
    }
}
