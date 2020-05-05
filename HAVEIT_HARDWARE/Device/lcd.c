/*
*
* by Lewis Loflin www.bristolwatch.com lewis@bvu.net
* http://www.bristolwatch.com/rpi/i2clcd.htm
* Using wiringPi by Gordon Henderson
*
*
* Port over lcd_i2c.py to C and added improvements.
* Supports 16x2 and 20x4 screens.
* This was to learn now the I2C lcd displays operate.
* There is no warrenty of any kind use at your own risk.
*
*/

#include <wiringPiI2C.h>
#include <wiringPi.h>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <sys/msg.h>
#include <sys/types.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>   
#include <bluetooth/bluetooth.h>   
#include <bluetooth/rfcomm.h>   
#include <signal.h>   
#include <pthread.h> 
#include <softPwm.h>

// Define some device parameters
#define I2C_ADDR   0x27 // I2C device address

// Define some device constants
#define LCD_CHR  1 // Mode - Sending data
#define LCD_CMD  0 // Mode - Sending command

#define LINE1  0x80 // 1st line
#define LINE2  0xC0 // 2nd line

#define LCD_BACKLIGHT  0x08  // On
//LCD_BACKLIGHT  0x00  //# Off

#define ENABLE  0b00000100 // Enable bit

#define dollId 3
#define SW 4
#define LED 14
#define Motor 1

void lcd_init(void);
void lcd_byte(int bits, int mode);
void lcd_toggle_enable(int bits);

// added by Lewis
void typeInt(int i);
void typeFloat(float myFloat);
void lcdLoc(int line); //move cursor
void ClrLcd(void); // clr LCD return home
void typeln(const char *s);
void typeChar(char val);
int fd;  // seen by all subroutines

struct mymsgbuf {
	long mtype;
	char mtext[300];
};

int s;
void ctrl_c_handler(int signal);
void close_sockets();
void *readMsg();
void *sendMsg();
char buf[1024] = { 0 };
char Position[7][16]={"middel","front","back","left","right","left_twisted","right_twisted"};
int Count[7]={0,};
int prev;

int main() {

	struct mymsgbuf inmsg;
	struct msqid_ds msqstat, msqstat1;
	key_t key, key1;
	int msgid, msgid1, len;
	int status;

		

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


	if (wiringPiSetup() == -1) exit(1);
	

	pinMode(SW, INPUT);
	pinMode(LED,OUTPUT);
	pinMode(Motor, PWM_OUTPUT);
	pwmSetMode(PWM_MODE_MS); 

  	pwmSetClock(384);
  	pwmSetRange(1000);

	fd = wiringPiI2CSetup(I2C_ADDR);
	
	
	key = 1;
	key1 = 2;

	if ((msgid = msgget(key, IPC_CREAT|0644)) < 0) {
		perror("msgget");
		exit(1);
	}
	
	if ((msgid1 = msgget(key1, IPC_CREAT|0644)) < 0) {
		perror("msgget1");
		exit(1);
	}

	printf("going 2 connect\n");
	state = connect(s, (struct sockaddr *)&addr, sizeof(addr));
		printf("wiring Set\n");
	lcd_init(); // setup LCD

	if (0 == state)
	{
		printf("connect success\n");
		pid_t pid = fork();
				if (pid == 0)
				{
					execlp("python","python", "/home/pi/Device/have_cushion.py", NULL);
				}
				else if (waitpid(pid, &status, 0) > 0)
				{
					if (WIFEXITED(status) && !WEXITSTATUS(status))
					{
						printf("res : %d\n", status);
						printf("program execution successful\n");
						lcd_init();

					}
					else if (WIFEXITED(status) && WEXITSTATUS(status))
					{
						if (WEXITSTATUS(status) == 127)
						{
							// execv failed 
							printf("execl failed\n");
						}
						else
						{
							printf("program terminated normally,"
								" but returned a non-zero status\n");
						}
					}
					else
					{
						printf("program didn't terminate normally\n");
					}
				}
				else {
					// waitpid() failed 
					printf("waitpid() failed\n");
				}
	}
		while (1)
		{
			if (msgctl(msgid, IPC_STAT, &msqstat))
			{
				perror("msgctl() 실패\n");
				exit(1);
			}

			time_t timer;
			struct tm* t;
			timer = time(NULL);
			t = localtime(&timer);
			char msg[2][300];

			if(Count[prev]<10)
			{
				strftime(msg[0], 300, "%Y-%m-%d", t);
				strftime(msg[1], 300, "%H:%M:%S", t);
				lcdLoc(LINE1);
				typeln(msg[0]);
				lcdLoc(LINE2);
				typeln(msg[1]);
				
				sleep(1);
			}
			
			
			//sleep(0.5);

			if (msqstat.msg_qnum > 0) {
				pid_t pid = fork();
				if (pid == 0)
				{
					execl("/home/pi/Device/./msgq_rcv", "/home/pi/Device/./msgq_rcv", NULL);
				}
				else if (waitpid(pid, &status, 0) > 0)
				{
					if (WIFEXITED(status) && !WEXITSTATUS(status))
					{
						printf("res : %d\n", status);
						printf("program execution successful\n");
						lcd_init();

					}
					else if (WIFEXITED(status) && WEXITSTATUS(status))
					{
						if (WEXITSTATUS(status) == 127)
						{
							// execv failed 
							printf("execl failed\n");
						}
						else
						{
							printf("program terminated normally,"
								" but returned a non-zero status\n");
						}
					}
					else
					{
						printf("program didn't terminate normally\n");
					}
				}
				else {
					// waitpid() failed 
					printf("waitpid() failed\n");
				}
			}
			
			else {
				if (msgctl(msgid1, IPC_STAT, &msqstat1))
				{
					perror("msgctl1() 실패\n");
					exit(1);
				}

				if (msqstat1.msg_qnum > 0 && digitalRead(SW) == LOW)
				{
					lcd_init();
					lcdLoc(LINE1);
					typeln("missing message");
					lcdLoc(LINE2);
					char msg[16];
					sprintf(msg, "Count : %d", msqstat1.msg_qnum);
					printf("%d\n", msqstat1.msg_qnum);
					typeln(msg);
					sleep(1);

					lcd_init();

					//
					int n = msqstat1.msg_qnum;
					for (int i = 0; i < n; i++)
					{
						len = msgrcv(msgid1, &inmsg, 300, 0, 0);

						char name[2][300];
						printf("%s",inmsg.mtext);
						char *ptr = strtok(inmsg.mtext, " ");
						strcpy(name[0], ptr);
						printf("%s ", name[0]);
						ptr = strtok(NULL, " ");
						strcpy(name[1], ptr);
						printf("%s\n", name[1]);
						lcdLoc(LINE1);
						typeln(name[0]);
						lcdLoc(LINE2);
						typeln(name[1]);
						sleep(2);
						lcd_init();
					}
					digitalWrite(LED,0);
					lcd_init();
				}
				else
				{
					if(state!=0)
					{
						//printf("state: %d\n",state);
						s = socket(AF_BLUETOOTH, SOCK_STREAM, BTPROTO_RFCOMM);
						addr.rc_family = AF_BLUETOOTH;
						addr.rc_channel = 1;
						str2ba(dest, &addr.rc_bdaddr);
						state = connect(s, (struct sockaddr *)&addr, sizeof(addr));
						if(state!=0)
							continue;
						else
						{
							printf("connect success!\n");
							// fork

							pid_t pid = fork();
				if (pid == 0)
				{
					execlp("python","python", "/home/pi/Device/have_cushion.py", NULL);
				}
				else if (waitpid(pid, &status, 0) > 0)
				{
					if (WIFEXITED(status) && !WEXITSTATUS(status))
					{
						printf("res : %d\n", status);
						printf("program execution successful\n");
						lcd_init();

					}
					else if (WIFEXITED(status) && WEXITSTATUS(status))
					{
						if (WEXITSTATUS(status) == 127)
						{
							// execv failed 
							printf("execl failed\n");
						}
						else
						{
							printf("program terminated normally,"
								" but returned a non-zero status\n");
						}
					}
					else
					{
						printf("program didn't terminate normally\n");
					}
				}
				else {
					// waitpid() failed 
					printf("waitpid() failed\n");
				}
						}
					}
					iret1 = pthread_create(&readT, NULL, readMsg, (void*)message1);
					if(buf[0]!='0'&&buf[0]!='9')
					{

						lcdLoc(LINE2);
						//char bbuf[16]={0,};
						//bbuf[0]=buf[0];
						// if(bbuf[0]=='0')
						// 	continue;
						int now=buf[0]-'0';
						printf("now: %d\n",now);

						if(prev==now)
						{	Count[now]++;
							printf("count : %d\n",Count[now]);
							if(Count[now]>=10)
							{
								lcd_init();
								printf("buf : %c\n",buf[0]);
								lcdLoc(LINE1);
								typeln("POSITION");
								lcdLoc(LINE2);
								typeln(Position[now]);
								//sleep(2);
								

								pwmWrite(Motor, 250 ); 
								sleep(1);

								pwmWrite(Motor, 30);
								sleep(1);

								pwmWrite(Motor, -250 ); 
								sleep(1);
								
								lcd_init();
							}
						}	
						else
						{
							lcd_init();
							memset(Count,0,sizeof(Count));	
							printf("prev : %d\n",prev);
						}
						prev=now;
						
					}
				}
			}
			


		}

	if(state==0)
	{

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
//	do {
		memset(buf, 0, sizeof(buf));
		//read data from the client   
		bytes_read = recv(s, buf, sizeof(buf), 0);
		fprintf(stdout, "Bytes read = %d\n", bytes_read);
//		if (bytes_read <= 0)break;
		fprintf(stdout, "<<>> %s", buf);
		sleep(2);
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




// float to string
void typeFloat(float myFloat) {
	char buffer[20];
	sprintf(buffer, "%4.2f", myFloat);
	typeln(buffer);
}

// int to string
void typeInt(int i) {
	char array1[20];
	sprintf(array1, "%d", i);
	typeln(array1);
}

// clr lcd go home loc 0x80
void ClrLcd(void) {
	lcd_byte(0x01, LCD_CMD);
	lcd_byte(0x02, LCD_CMD);
}

// go to location on LCD
void lcdLoc(int line) {
	lcd_byte(line, LCD_CMD);
}

// out char to LCD at current position
void typeChar(char val) {

	lcd_byte(val, LCD_CHR);
}


// this allows use of any size string
void typeln(const char *s) {

	while (*s) lcd_byte(*(s++), LCD_CHR);

}

void lcd_byte(int bits, int mode) {

	//Send byte to data pins
	// bits = the data
	// mode = 1 for data, 0 for command
	int bits_high;
	int bits_low;
	// uses the two half byte writes to LCD
	bits_high = mode | (bits & 0xF0) | LCD_BACKLIGHT;
	bits_low = mode | ((bits << 4) & 0xF0) | LCD_BACKLIGHT;

	// High bits
	wiringPiI2CReadReg8(fd, bits_high);
	lcd_toggle_enable(bits_high);

	// Low bits
	wiringPiI2CReadReg8(fd, bits_low);
	lcd_toggle_enable(bits_low);
}

void lcd_toggle_enable(int bits) {
	// Toggle enable pin on LCD display
	delayMicroseconds(500);
	wiringPiI2CReadReg8(fd, (bits | ENABLE));
	delayMicroseconds(500);
	wiringPiI2CReadReg8(fd, (bits & ~ENABLE));
	delayMicroseconds(500);
}


void lcd_init() {
	// Initialise display
	lcd_byte(0x33, LCD_CMD); // Initialise
	lcd_byte(0x32, LCD_CMD); // Initialise
	lcd_byte(0x06, LCD_CMD); // Cursor move direction
	lcd_byte(0x0C, LCD_CMD); // 0x0F On, Blink Off
	lcd_byte(0x28, LCD_CMD); // Data length, number of lines, font size
	lcd_byte(0x01, LCD_CMD); // Clear display
	delayMicroseconds(500);
}

