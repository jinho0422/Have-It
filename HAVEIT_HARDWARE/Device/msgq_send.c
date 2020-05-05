#include <sys/msg.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

struct mymsgbuf{
    long mtype;
    char mtext[300];
};

int main(int argc,int argv[])
{
    key_t key;
    int msgid;
    struct mymsgbuf mesg;
    key=ftok("keyfile",1);
    msgid=msgget(key,IPC_CREAT|0644);
    if(msgid==-1)
    {
        perror("msgget");
        exit(1);
    }
    mesg.mtype=1;

    strcpy(mesg.mtext,argv[1]);
    strcat(mesg.mtext," ");
    strcat(mesg.mtext,argv[2]);
    strcat(mesg.mtext,"\n");
    
    printf(mesg.mtext);
    if(msgsnd(msgid,(void *)&mesg,300,IPC_NOWAIT)==-1){
        perror("msgsnd");
        exit(1);
    }

    return 0;
}