#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include "test.h"

using namespace std;

int main(){
    bool varTest = testlib();
    cout << "The result in example of sharedlib: " << varTest << endl;

    return 0;
}