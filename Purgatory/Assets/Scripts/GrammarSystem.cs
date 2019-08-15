using System.Collections;
using System.Collections.Generic;
using System;
using UnityEngine;
using System.Text;
using System.IO;

public class GrammarSystem : MonoBehaviour
{
    //Random rand;

    [SerializeField]
    StateManager sm;

    private void Awake()
    {
        GeneratedAssets = new Dictionary<string, TextAsset>();
    }

    public struct Pair
    {
        public string rule;
        public float probability;

        public Pair(string rulein, float probabilityin)
        {
            rule = rulein;
            probability = probabilityin;
        }
    }

    public struct ProductionRules
    {

        public Dictionary<string, List<Pair>> rules;

        public List<string> types;

        public ProductionRules(string typein, List<string> typesin, List<List<Pair>> pairs)
        {
            types = new List<string>();
            types.Add(typein);

            rules = new Dictionary<string, List<Pair>>();
            for(int i = 0; i < typesin.Count && i < pairs.Count; i++)
            {
                rules.Add(types[i], pairs[i]);
            }
        }

        public ProductionRules(bool h = true)
        {
            types = new List<string>();
            rules = new Dictionary<string, List<Pair>>();
        }

        public void AddType(string type)
        {
            types.Add(type);
        }

        public void AddPairs(List<List<Pair>> pairs, List<string> typesin)
        {
            for (int i = 0; i < pairs.Count; i++)
            {
                if(!rules.ContainsKey(typesin[i])) rules.Add(typesin[i], pairs[i]);
            }
        }

    }

    ProductionRules prodRules = new ProductionRules(true);

    List<string> prevContradictions = new List<string>();


    public Dictionary<string, TextAsset> GeneratedAssets;

    public void ParseProductionRules(string name)
    {
        string[] path = name.Split('/');
        string truename = path[path.Length - 1];

        if (prodRules.types.Contains(truename)) return;

        TextAsset file = Resources.Load("Textfiles/Grammar/Rules/" + name) as TextAsset;


        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        writer.Write(file.text);
        writer.Flush();
        stream.Position = 0;
        var r = new StreamReader(stream, Encoding.UTF8);
        string line;

        string type = r.ReadLine();

        List<string> variables = new List<string>();
        List<List<Pair>> rules = new List<List<Pair>>();

        string currVariable;
        List<Pair> currRules;

        do
        {
            

            line = r.ReadLine();


            if (line != null)
            {
                currRules = new List<Pair>();

                string[] lineData = line.Split(':');

                if (lineData.Length <= 1) continue;

                currVariable = lineData[0];                

                lineData = lineData[1].Split(',');

                if (lineData.Length < 1) continue;

                float[] probs = GenerateRandomProbabilities(lineData.Length);

                for(int i = 0; i < lineData.Length; i++)
                {
                    Pair p = new Pair(lineData[i], probs[i]);
                    currRules.Add(p);
                }

                variables.Add(currVariable);
                rules.Add(currRules);

            }
        } while (line != null);

        r.Close();
        prodRules.AddType(truename);
        prodRules.AddPairs(rules, variables);

    }

    float[] GenerateRandomProbabilities(int size)
    {

        float[] probs = new float[size];

        float totalprob = 0;

        for(int i = 0; i < size; i++)
        {
            probs[i] = UnityEngine.Random.value * 9 + 1;
            totalprob += probs[i];
        }

        for(int i = 0; i < size; i++)
        {
            probs[i] /= totalprob;
        }

        return probs;
    }

    string GetTokenFromRules(string token, ProductionRules pr, string notThis = "", bool isContradiction = false)
    {
        float rand = UnityEngine.Random.value;
        float tracker = 0;

        List<Pair> rules = pr.rules[token];

        for (int i = 0; i < rules.Count; i++)
        {
            if (rules[i].rule == notThis) continue;
            if (isContradiction && prevContradictions.Contains(rules[i].rule)) continue;
            tracker += rules[i].probability;
            if (tracker >= rand) return rules[i].rule;
        }

        if (rules[rules.Count - 1].rule == notThis) return rules[0].rule;
        return rules[rules.Count - 1].rule;

    }

    public Dictionary<string, string> GenerateNarrative(string name)
    {
        string[] path = name.Split('/');
        string truename = path[path.Length - 1];

        ProductionRules pr = prodRules;

        Debug.Log(name);

        Dictionary<string, string> savedTokens = new Dictionary<string, string>();

        TextAsset file = Resources.Load("Textfiles/Grammar/Axioms/" + name) as TextAsset;

        string ax = file.text;

        string[] axiom = ax.Split('\n');

        string output = "";

        string token = "";
        string result = "";

        for(int i = 0; i < axiom.Length; i++)
        {
            char[] chars = axiom[i].ToCharArray();

            for(int c = 0; c < chars.Length; c++)
            {
                if (chars[c] == '<')
                {
                    output += '@';
                    c++;
                    token = "";
                    while (chars[c] != '>')
                    {
                        token += chars[c];
                        c++;
                    }
                    result = GetTokenFromRules(token, pr);
                    output += result;
                    output += '@';
                    savedTokens.Add(token, result);
                }
                else output += chars[c];
            }

            output += '\n';
            
        }

        Debug.Log(output);

        TextAsset outputasset = new TextAsset(output);

        GeneratedAssets.Add(truename, outputasset);


        return savedTokens;

    }

    public void GenerateEvidence(Evidence[] evidence, Dictionary<string, string> tokens)
    {
        // set up murder weapon
        evidence[0].SetName(tokens["weapon"]);
        GenerateTraits("weapon", evidence[0], tokens);
        AddTraitsFromNarrative(tokens, "weapon", true, evidence[0]);
        evidence[0].SetDescription(GeneratedAssets["weapon"].text);
        evidence[0].AddDetail("weapon", tokens["weapon"]);
        evidence[0].SetVisual("Weapon");

        // set up autopsy report
        evidence[1].SetName("Autopsy report");
        GenerateTraits("autopsyreport", evidence[1], tokens);
        AddTraitsFromNarrative(tokens, "autopsyreport", true, evidence[1]);
        evidence[1].SetDescription(GeneratedAssets["autopsyreport"].text);
        evidence[1].SetVisual("Autopsy Report");

        // set up victim
        evidence[2].SetName(tokens["victim"]);
        GenerateTraits("victim", evidence[2], tokens);
        AddTraitsFromNarrative(tokens, "victim", true, evidence[2]);
        evidence[2].SetDescription(GeneratedAssets["victim"].text);
        evidence[2].AddDetail("victim", tokens["victim"]);
        evidence[2].SetVisual("Victim");

        List<string> prevTraits = new List<string>();

        // set up defendant
        evidence[3].SetName(tokens["defendant"]);
        GenerateTraits("defendant", evidence[3],tokens, true, prevTraits);
        AddTraitsFromNarrative(tokens, "defendant", true, evidence[3]);
        evidence[3].SetDescription(GeneratedAssets["defendant"].text);
        evidence[3].AddDetail("defendant", tokens["defendant"]);
        evidence[3].SetVisual("Defendant");

        int w1 = UnityEngine.Random.Range(0, 3);
        int w2 = UnityEngine.Random.Range(0, 3);
        if(w1 == w2)
        {
            if (w1 == 0) w2 = 1;
            else w2 = 0;
        }

        // set up first witness
        evidence[4].SetName(tokens["witness1"]);
        GenerateTraits("witness1", evidence[4], tokens, true, prevTraits);
        AddTraitsFromNarrative(tokens, "witness1", true, evidence[4]);
        evidence[4].SetDescription(GeneratedAssets["witness1"].text);
        evidence[4].AddDetail("witness1", tokens["witness1"]);
        evidence[4].SetVisual("" + w1 + "headshot");

        // set up second witness
        evidence[5].SetName(tokens["witness2"]);
        GenerateTraits("witness2", evidence[5], tokens, true, prevTraits);
        AddTraitsFromNarrative(tokens, "witness2", true, evidence[5]);
        evidence[5].SetDescription(GeneratedAssets["witness2"].text);
        evidence[5].AddDetail("witness2", tokens["witness2"]);
        evidence[5].SetVisual("" + w2 + "headshot");

        sm.SetWitnessSprites(w1, w2);

    }

    public void GenerateTraits(string type, Evidence e, Dictionary<string, string> evidencelist, bool isWitness = false, List<string> prevTraits = null)
    {
        ParseProductionRules("Evidence/" + type);
        if (type == "weapon") Debug.Log(prodRules.rules.ContainsKey("material"));

        e.details = GenerateNarrative("Evidence/" + type);
        List<string> dets = new List<string>(e.details.Keys);
        List<string> detVals = new List<string>(e.details.Values);

        for(int j = 0; j < dets.Count; j++)
        {
            if(!evidencelist.ContainsKey(dets[j]))
            {
                evidencelist.Add(dets[j], detVals[j]);
            }
        }

        if (isWitness)
        {
            List<string> oldtraits = new List<string>();
            List<string> newtraits = new List<string>();
            List<string> traittypes = new List<string>();
            List<string> keyList = new List<string>(e.details.Keys);

            foreach (string trait in keyList)
            {
                if(prevTraits.Contains(e.details[trait]))
                {
                    ProductionRules pr = prodRules;

                    List<Pair> rules = pr.rules[trait];
                    for(int i = 0; i < rules.Count; i++)
                    {
                        if(!prevTraits.Contains(rules[i].rule))
                        {
                            traittypes.Add(trait);
                            oldtraits.Add(e.details[trait]);
                            Debug.Log("must replace " + e.details[trait] + " with " + rules[i].rule);
                            e.details[trait] = rules[i].rule;
                            newtraits.Add(e.details[trait]);
                            break;
                        }
                    }
                    
                }
                prevTraits.Add(e.details[trait]);
                if (!evidencelist.ContainsKey(trait))
                {
                    evidencelist.Add(trait, e.details[trait]);
                } else
                {
                    evidencelist[trait] = e.details[trait];
                }
                
            }
            ReplaceTraits(oldtraits, newtraits, type, traittypes);
        }

    }

    void ReplaceTraits(List<string> oldtraits, List<string> newtraits, string file, List<string> traittypes)
    {
        
        if (oldtraits.Count == 0 || newtraits.Count == 0 || traittypes.Count == 0) return;

        if(oldtraits.Count != newtraits.Count || traittypes.Count != newtraits.Count || oldtraits.Count != traittypes.Count) {
            Debug.Log("halp the traits are bad");
            return;
        }

        Debug.Log("replacing traits");
        for(int i = 0; i < oldtraits.Count; i++)
        {
            Debug.Log(oldtraits[i] + " -> " + newtraits[i]);
        }
        

        string ax = GeneratedAssets[file].text;

        string[] axiom = ax.Split('\n');

        string output = "";

        string token = "";
        string result = "";

        for (int i = 0; i < axiom.Length; i++)
        {
            char[] chars = axiom[i].ToCharArray();

            for (int c = 0; c < chars.Length; c++)
            {
                if (chars[c] == '@')
                {
                    output += '@';
                    c++;
                    token = "";
                    while (chars[c] != '@')
                    {
                        token += chars[c];
                        c++;
                    }
                    if (oldtraits.Contains(token))
                    {
                        for (int k = 0; k < newtraits.Count; k++)
                        {
                            if (k == oldtraits.IndexOf(token))
                            {
                                result = newtraits[k];
                                Debug.Log("successfully replaced trait");
                                break;
                            }
                            else
                            {
                                result = token;
                                Debug.Log("trait failed to be replaced");
                            }

                        }
                    } else
                    {
                        result = token;
                    }
                    output += result;
                    output += '@';
                    c++;
                }
                else output += chars[c];
            }

            output += '\n';

        }

        TextAsset outputasset = new TextAsset(output);

        GeneratedAssets[file] = outputasset;
    }

    void AddTraitsFromNarrative(Dictionary<string, string> tokens, string file, bool isEvidence = false, Evidence e = null, bool highlight = true)
    {
        string ax = GeneratedAssets[file].text;

        string[] axiom = ax.Split('\n');

        string output = "";

        string token = "";
        string result = "";

        for (int i = 0; i < axiom.Length; i++)
        {
            char[] chars = axiom[i].ToCharArray();

            for (int c = 0; c < chars.Length; c++)
            {
                if (chars[c] == '[')
                {
                    if(highlight)output += '@';
                    c++;
                    token = "";
                    while (chars[c] != ']')
                    {
                        token += chars[c];
                        c++;
                    }
                    result = tokens[token];
                    output += result;
                    if(isEvidence)
                    {
                        e.details.Add(token, result);
                    }
                    if(highlight)output += '@';
                }
                else output += chars[c];
            }

            output += '\n';

        }

        TextAsset outputasset = new TextAsset(output);

        GeneratedAssets[file] = outputasset;
    }

    public void GenerateObjection(Dictionary<string, string> tokens, string[] set)
    {
        TextAsset file = Resources.Load("Textfiles/Grammar/Axioms/Objections/" + set[0]) as TextAsset;

        string ax = file.text;

        string[] axiom = ax.Split('\n');

        string output = "";

        string token = "";
        string result = "";

        for (int i = 0; i < axiom.Length; i++)
        {
            char[] chars = axiom[i].ToCharArray();

            for (int c = 0; c < chars.Length; c++)
            {
                if (chars[c] == '<')
                {
                    output += '@';
                    c++;
                    token = "";
                    while (chars[c] != '>')
                    {
                        token += chars[c];
                        c++;
                    }
                    Debug.Log(token + " " + set[2]);
                    if (token == "truth") result = set[1];
                    else if (token == "lie") result = set[2];
                    output += result;
                    output += '@';
                }
                else output += chars[c];
            }
            output += '\n';

        }

        TextAsset outputasset = new TextAsset(output);

        if (GeneratedAssets.ContainsKey(set[0])) GeneratedAssets[set[0]] = outputasset;
        else GeneratedAssets.Add(set[0], outputasset);

        AddTraitsFromNarrative(tokens, set[0], false, null, false);
    }

    public void GenerateTransition(Dictionary<string, string> tokens, string name, string nextname)
    {
        TextAsset file = Resources.Load("Textfiles/Grammar/Axioms/Transitions/" + name) as TextAsset;

        string ax = file.text;

        string[] axiom = ax.Split('\n');

        string output = "";

        string token = "";

        for (int i = 0; i < axiom.Length; i++)
        {
            char[] chars = axiom[i].ToCharArray();

            for (int c = 0; c < chars.Length; c++)
            {
                if (chars[c] == '<')
                {
                    c++;
                    token = "";
                    while (chars[c] != '>')
                    {
                        token += chars[c];
                        c++;
                    }
                    if (token == "testimony" || token == "dialogue") output += nextname;
                }
                else output += chars[c];
            }
            output += '\n';

        }

        TextAsset outputasset = new TextAsset(output);

        if (GeneratedAssets.ContainsKey(name)) GeneratedAssets[name] = outputasset;
        else GeneratedAssets.Add(name, outputasset);

        AddTraitsFromNarrative(tokens, name);
    }

    public void GenerateConfession(Dictionary<string, string> tokens, string name)
    {
        TextAsset file = Resources.Load("Textfiles/Grammar/Axioms/Confessions/" + name) as TextAsset;

        string ax = file.text;

        string[] axiom = ax.Split('\n');

        string output = "";

        string token = "";

        bool selfculprit = UnityEngine.Random.value > 0.5;


        for (int i = 0; i < axiom.Length; i++)
        {
            char[] chars = axiom[i].ToCharArray();

            for (int c = 0; c < chars.Length; c++)
            {
                if (chars[c] == '<')
                {
                    c++;
                    token = "";
                    while (chars[c] != '>')
                    {
                        token += chars[c];
                        c++;
                    }
                    if (token == "culprit")
                    {
                        if (selfculprit) output += "me";
                        else output += "[witness1]";
                    }
                    else if(token == "prn")
                    {
                        if (selfculprit) output += "I";
                        else output += "[witness1]";
                    }
                    else if(token == "accomplice")
                    {
                        if (selfculprit) output += "[witness1]";
                        else output += "me";
                    }
                }
                else output += chars[c];
            }
            output += '\n';

        }

        TextAsset outputasset = new TextAsset(output);

        if (GeneratedAssets.ContainsKey(name)) GeneratedAssets[name] = outputasset;
        else GeneratedAssets.Add(name, outputasset);

        AddTraitsFromNarrative(tokens, name);
    }

    public void GenerateTestimony(string name, string narrative, Dictionary<string, string> tokens, int contracount)
    {
        ProductionRules pr = prodRules;

        Dictionary<string, string> savedTokens = new Dictionary<string, string>();

        TextAsset file = Resources.Load("Textfiles/Grammar/Axioms/Testimony/" + name) as TextAsset;

        string ax = file.text;

        string[] axiom = ax.Split('\n');

        string output = "";

        string token = "";
        string result = "";
        string truth = "";

        List<int> contradictions = new List<int>();

        for(int i = 0; i < contracount; i++)
        {
            int cont = UnityEngine.Random.Range(3, axiom.Length);
            while(contradictions.Contains(cont)) cont = UnityEngine.Random.Range(3, axiom.Length);
            contradictions.Add(cont);
        }

        for (int i = 0; i < axiom.Length; i++)
        {
            char[] chars = axiom[i].ToCharArray();

            if (contradictions.Contains(i)) output += "lie;";
            else if(i >= 3) output += "truth;";

            for (int c = 0; c < chars.Length; c++)
            {
                if (chars[c] == '<')
                {
                    output += '@';
                    c++;
                    token = "";
                    while (chars[c] != '>')
                    {
                        token += chars[c];
                        c++;
                    }
                    Debug.Log(token);
                    truth = tokens[token];
                    if(contradictions.Contains(i)) result = GetTokenFromRules(token, pr, tokens[token], true);
                    else result = truth;

                    output += result;
                    output += '@';
                    savedTokens.Add(token, result);
                }
                else output += chars[c];
            }
            if(contradictions.Contains(i))
            {
                output += ";" + truth + ";" + result;
                prevContradictions.Add(result);
            }
            output += '\n';

        }

        output = output.Substring(0, output.Length - 1);


        Debug.Log(output);

        TextAsset outputasset = new TextAsset(output);

        if (GeneratedAssets.ContainsKey(name)) GeneratedAssets[name] = outputasset;
        else GeneratedAssets.Add(name, outputasset);

        AddTraitsFromNarrative(tokens, name);

        


        return;
    }



}
