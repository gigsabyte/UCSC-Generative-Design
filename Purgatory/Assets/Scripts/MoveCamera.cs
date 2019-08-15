using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveCamera : MonoBehaviour
{
    [SerializeField]
    GameObject[] positions = new GameObject[3];

    int currposition = 1;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    public void MoveToPosition(int pos)
    {
        Vector3 position = positions[pos].transform.position;
        position.z = -10;
        transform.position = position;
    }
}
