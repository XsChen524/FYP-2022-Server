#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include "certificate.h"

using namespace std;

int main(){
    std::string rootHash = GenerateProof("secret", "randomkey");
    bool isVerified = VerifyProof("randomkey", rootHash);

    cout << "The result of sharedlib is: " << isVerified << endl;

    return 0;
}