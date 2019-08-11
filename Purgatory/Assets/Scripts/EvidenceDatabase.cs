using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EvidenceDatabase : MonoBehaviour
{
    [SerializeField]
    Sprite[] sprites;

    Dictionary<string, Sprite> database;

    // Start is called before the first frame update
    void Awake()
    {
        InitializeDatabase();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    void InitializeDatabase()
    {
        database = new Dictionary<string, Sprite>();

        for(int i = 0; i < sprites.Length; i++)
        {
            string key = sprites[i].name;
            Debug.Log(key);
            Sprite val = sprites[i];
            database.Add(key, val);
        }
    }

    public Sprite getSpriteByName(string key)
    {
        Debug.Log(">" + key + "< is the name of the key");
        return database[key];
    }
}
