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
    GameObject healthbox;
    [SerializeField]
    GameObject healthbar;

    public bool testimonyPaused = false;

    public float health = 128;

    // Start is called before the first frame update
    void Start()
    {
        gs.ParseProductionRules("False");
        gs.GenerateNarrative("False");

        BeginDialogue("test", false);
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void BeginTestimony(string name)
    {
        dm.SetInDialogue(false);
        StartCoroutine(Transition(ContBeginTestimony, name));
    }

    public void ContBeginTestimony(string name)
    {
        tm.LoadTestimony(name);
        tm.SetInTestimony(true);
        arrows.SetActive(true);
    }

    public void BeginDialogue(string name, bool obj)
    {
        tm.SetInTestimony(false);
        arrows.SetActive(false);
        if(obj)
        {
            StartCoroutine(MakeObjection(ContBeginDialogue, name));
        } else
        {
            StartCoroutine(Transition(ContBeginDialogue, name));
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

        for(float i = 0; i < amount; i++)
        {
            health -= lose;

            healthbar.GetComponent<RectTransform>().sizeDelta = new Vector2(health, 20);
            yield return null;

        }
        yield return new WaitForSeconds(0.25f);
        healthbox.GetComponent<Animator>().Play("SlideOut");
        yield return new WaitForSeconds(0.25f);
        dm.waiting = false;
    }

    public IEnumerator MakeObjection(Action returnFunc)
    {
        objection.SetActive(true);

        objection.GetComponent<Animator>().Play("Shake");
        yield return new WaitForSeconds(0.5f);

        objection.SetActive(false);

        returnFunc();
    }

    public IEnumerator MakeObjection(Action<string> returnFunc, string name)
    {
        objection.SetActive(true);

        objection.GetComponent<Animator>().Play("Shake");
        yield return new WaitForSeconds(0.5f);

        objection.SetActive(false);

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

    public IEnumerator Transition(Action<string> returnFunc, string name)
    {
        fade.SetActive(true);
        fade.GetComponent<Animator>().Play("FadeOut");
        yield return new WaitForSeconds(0.625f);
        returnFunc(name);
        fade.GetComponent<Animator>().Play("FadeIn");
        yield return new WaitForSeconds(0.65f);
        fade.SetActive(false);
    }
}
