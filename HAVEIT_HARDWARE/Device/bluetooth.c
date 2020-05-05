#include <stdio.h>   
#include <stdlib.h>   
#include <signal.h>   
#include <pthread.h>   
#include <unistd.h>   
#include <sys/socket.h>   
#include <bluetooth/bluetooth.h>   
#include <bluetooth/rfcomm.h>   


int s;
void ctrl_c_handler(int signal);
void close_sockets();
void *readMsg();
void *sendMsg();


int main(int argc, char **argv) {
	(void)signal(SIGINT, ctrl_c_handler);


	pthread_t readT, writeT;
	char *message1 = "Read thread\n";
	char *message2 = "Write thread\n";
	int iret1, iret2;

	struct sockaddr_rc addr = { 0 };
	int state;
	char dest[18] = "00:19:10:08:56:BF";
	char msg[25];

	//allocate a socket   
	s = socket(AF_BLUETOOTH, SOCK_STREAM, BTPROTO_RFCOMM);
	addr.rc_family = AF_BLUETOOTH;
	addr.rc_channel = 1;
	str2ba(dest, &addr.rc_bdaddr);

	//connect to server   
	printf("going 2 connect\n");
	state = connect(s, (struct sockaddr *)&addr, sizeof(addr));

	//send a message   
	if (0 == state) {
		printf("connect success\n");

		/* Create independent threads each of which will execute function */


while(1)
		{
      iret1 = pthread_create(&readT, NULL, readMsg, (void*)message1);
		
      printf("aaa\n");
    sleep(1);
    }
    iret2 = pthread_create(&writeT, NULL, sendMsg, (void*)message2);

		pthread_join(readT, NULL);
		pthread_join(writeT, NULL);
    
	}


	close_sockets();
	return 0;
}

void *sendMsg() {
	char msg[25];
	int state;

	//do {
		memset(msg, 0, sizeof(msg));
		fgets(msg, 24, stdin);
		//if (strncmp("EXIT", msg, 4) == 0 || strncmp("exit", msg, 4) == 0)break;
		state = send(s, msg, strlen(msg), 0);
		fprintf(stdout, "state = %d\n", state);
//	} while (state > 0);

  return NULL;
}

void *readMsg() {
	int bytes_read;
	char buf[1024] = { 0 };
//	do {
		memset(buf, 0, sizeof(buf));
		//read data from the client   
		bytes_read = recv(s, buf, sizeof(buf), 0);
		fprintf(stdout, "Bytes read = %d\n", bytes_read);
//		if (bytes_read <= 0)break;
		fprintf(stdout, "<<>> %s", buf);
	//} while (1);

  return NULL;
}

void close_sockets() {
	close(s);
	fprintf(stdout, "Close sockets\n");
}

void ctrl_c_handler(int signal) {
	fprintf(stdout, "Interrupt caught[NO: %d ]\n", signal);
	close_sockets();
	exit(0);
}

