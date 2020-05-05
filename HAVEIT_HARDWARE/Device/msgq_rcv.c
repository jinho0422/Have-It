#include <sys/msg.h>
#include <sys/types.h>
#include <stdlib.h>
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

struct mymsgbuf{
    long mtype;
    char mtext[300];
};

int main(void){
    struct mymsgbuf inmsg;
    key_t key;
    int msgid,len;
	//FILE *fp=fopen('./data.txt','w+');



    key=ftok("keyfile",1);
    if((msgid=msgget(key,0))<0){
        perror("msgget");
        exit(1);
    }

    int fd;
    
    len=msgrcv(msgid,&inmsg,300,0,0);
    // if((fd=open("./data.txt",O_WRONLY))>0)
    // {
    //     write(fd,inmsg.mtext,strlen(inmsg.mtext)-1);
    // }

    pid_t pid=fork();
    int status;

    if(pid==-1)
    {
        printf("fork err\n");
    }
    else if(pid==0)
    {
<<<<<<< HEAD
     	//printf("text : %s\n",inmsg.mtext);
        //execlp("python","python", "/home/pi/Device/I2C_LCD1.py",name[0],name[1],name[3],name[2],NULL); 
        execlp("python","python", "/home/pi/Device/LCD.py",name[0],name[1],name[3],name[2],NULL); 
    
    }
    else if (waitpid(pid, &status, 0) > 0) 
    {
		if (WIFEXITED(status) && !WEXITSTATUS(status))  
        {   
            printf("res : %d\n",status);
            printf("program execution successful\n"); 
            //execlp("python","python","clock.py",NULL);
        }      
        else if (WIFEXITED(status) && WEXITSTATUS(status)) 
        { 
            if (WEXITSTATUS(status) == 127) 
            { 
=======
        printf("text : %s\n",inmsg.mtext);
        execl('python', 'I2C_LCD1.py',inmsg.mtext);
    }
    else if (waitpid(pid, &status, 0) > 0) { 
              
            if (WIFEXITED(status) && !WEXITSTATUS(status))  
              printf("program execution successful\n"); 
              
            else if (WIFEXITED(status) && WEXITSTATUS(status)) { 
                if (WEXITSTATUS(status) == 127) { 
  
>>>>>>> be4c10f9dd2e49a512588da2305e9a5be5009fd4
                    // execv failed 
                    printf("execl failed\n"); 
                } 
                else 
                    printf("program terminated normally,"
                       " but returned a non-zero status\n");                 
            } 
            else 
               printf("program didn't terminate normally\n");             
        }  
        else { 
           // waitpid() failed 
           printf("waitpid() failed\n"); 
        } 
      exit(0); 


    // system("python I2C_LCD1.py");
    // system("python servo_test.py");
    
	//fprintf(inmsg.mtext,fp);
	//fclose(fp);

    printf("Received Msg = %s, Len=%d\n",inmsg.mtext,len);
	

    return 0;
}
