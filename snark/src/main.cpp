#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include "certificate.h"

using namespace std;

int main(){
    char* rootHash = GenerateProof(1, "secret", "randomkey");
    cout << "root hash is: " << rootHash << endl;

    bool isVerified = VerifyProof(1, "randomkey", rootHash);
    cout << "The result of sharedlib is: " << isVerified << endl;
    return 0;
}