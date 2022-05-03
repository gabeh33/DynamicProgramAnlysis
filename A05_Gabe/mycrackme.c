#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <stdlib.h>

#define PASS "P@SS-4-CS4910"
#define PASSLEN 13

extern "C" int my_asm_func(char*, int);


int my_compare(char *guess) {
    int i;
    char cmp[15];
    strcpy(cmp, "supersecret99X"); 

    char xored[13];

    strcat(guess, "X");
    for (i = 0; i < 13; ++i) {
	if (i % 2 == 0) {
	   xored[i] = (char)(guess[i] ^ cmp[i+1]);
	} else {
	   xored[i] = (char)(guess[i] ^ cmp[i-1]);
	}	
    }
    
    char check[14] = {0x25, 0x33, 0x36, 0x23, 0x5e, 0x46, 0x4e, 0x26, 0x36, 0x46, 0x0, 0x45, 0x68};
    int ret = 0;
    for (int j = 0; j < 13; j++) {
	    if (xored[j] != check[j]) {
		    ret = 1;
	    }
    }
    return ret;
}

int main(int argc, char** argv) {
    if (argc < 2) {
        printf("Error: must run with a password: %s [pass]\n", argv[0]);
        return 1;
    }

    // Copy pass onto the heap so it can be mutated by my_asm_func
    char *pass = strndup(PASS, PASSLEN);

    char *guess = argv[1];

    // Call into assembly code to do some shenanigans on the password
    // or you can change this to something else
    my_asm_func(pass, PASSLEN);
    
    if (my_compare(guess) == 0) {
        printf("GOOD PASSWORD\n");
    }else{
        printf("WRONG PASSWORD\n");
        // Just for debugging:
        printf("\t answer was %s\n", pass);
    }

    free(pass);
    return 0;
}


