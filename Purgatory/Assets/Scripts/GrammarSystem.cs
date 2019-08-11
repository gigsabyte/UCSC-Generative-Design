using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Text;
using System.IO;

public class GrammarSystem : MonoBehaviour
{
    //Random rand;

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

        public string type;

        public ProductionRules(string typein, List<string> types, List<List<Pair>> pairs)
        {
            type = typein;

            rules = new Dictionary<string, List<Pair>>();
            for(int i = 0; i < types.Count && i < pairs.Count; i++)
            {
                rules.Add(types[i], pairs[i]);
            }
        }

    }

    ProductionRules currProdRules;

    public Dictionary<string, TextAsset> GeneratedAssets;

    public void ParseProductionRules(string name)
    {
        TextAsset file = Resources.Load("Textfiles/Grammar/Rules/Narratives/" + name) as TextAsset;


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
            Debug.Log(line);

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
                    Debug.Log(p.rule + " " + p.probability);
                    currRules.Add(p);
                }

                variables.Add(currVariable);
                rules.Add(currRules);

            }
        } while (line != null);

        r.Close();

        currProdRules =  new ProductionRules(type, variables, rules);

    }

    float[] GenerateRandomProbabilities(int size)
    {

        float[] probs = new float[size];

        float totalprob = 0;

        for(int i = 0; i < size; i++)
        {
            probs[i] = Random.value * 9 + 1;
            totalprob += probs[i];
        }

        for(int i = 0; i < size; i++)
        {
            probs[i] /= totalprob;
        }

        return probs;
    }

    public Dictionary<string, string> GenerateNarrative(string name)
    {
        ProductionRules pr = currProdRules;

        Dictionary<string, string> savedTokens = new Dictionary<string, string>();

        TextAsset file = Resources.Load("Textfiles/Grammar/Axioms/Narratives/" + name) as TextAsset;

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

        GeneratedAssets.Add(name, outputasset);

        return savedTokens;

    }

    string GetTokenFromRules(string token, ProductionRules pr)
    {
        float rand = Random.value;
        float tracker = 0;

        List<Pair> rules = pr.rules[token];
        
        for(int i = 0; i < rules.Count; i++)
        {
            tracker += rules[i].probability;
            if (tracker >= rand) return rules[i].rule;
        }

        return rules[rules.Count - 1].rule;
        
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }


}
