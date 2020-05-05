//  mux ic : 74HC4067. it can connect 16 pins with 4 signal pins
//  This shield adopts 2 mux ic. so it can connect 32 pins with 4 signal pis and 2 enable pins

 /*
   *    방석 센서의 번호. 센서는 총 31개가 가로로 3줄로 배열되어 있습니다.
   *    아래 그림은 adc_value에 담긴 측정값이 어느 위치의 센서값인지를 설명합니다.
   *    예를 들어 adc_value[14]는 1번째 줄의 3번째 센서의 측정값입니다. 
   *    adc_value[2]는 3번째 줄의 3번째 센서의 측정값입니다.
   *  1st row (6 cells):                       10, 12, 14, 16, 18, 20
   *  2nd row (15 cells) :   5, 6, 7, 8, 9, 11, 13, 15(center), 17, 19, 21, 22, 23, 24, 25
   *  3rd row (10 cells) :                 0, 1, 2, 3, 4, 26, 27, 28, 29, 30
   * 
   * 무게 중심의 X 좌표는 2번 줄의 측정값으로 계산합니다.
   * 무게 중심의 Y 좌표는 1, 3번 줄의 측정값으로 계산합니다.
   */
   
int S0  = 5;
int S1  = 4;
int S2  = 3;
int S3  = 2;
 
//  mux ic selection pins. This shield uses 2 mux ic.
int En0 = 7;  //  Low enabled
int En1 = 6;  //  Low enabled
 
int controlPin[] = {S0,S1,S2,S3,En0,En1}; // same to {5, 4, 3, 2, 7, 6}

 
// adc pin, read sensor value. 
int ADC_pin = A3; // Arduino ProMicro : A3, Arduino NANO : A7
int adc_value[32];


//----------------------------------------------
//  설정 - 키이벤트를 발생하는 문턱값. 무게중심의 좌표값. (범위 : -1.0 ~ 1.0)
//        문턱값을 넘기면 키가 눌리게 됨. 0 에 가까울수록 민감하게 동작.
const float THRESHOLD_COP_forth   = 0.3;    // 앞 쏠림. Y가 이 값보다 커야 키이벤트 발생.
const float THRESHOLD_COP_back    = -0.45;  // 뒤 쏠림. Y가 이 값보다 작아야 키이벤트 발생.
const float THRESHOLD_COP_left    = -0.20;  // 좌 쏠림. X가 이 값보다 작아야 키이벤트 발생.
const float THRESHOLD_COP_right   = 0.20;   // 우 쏠림. X가 이 값보다 커야 키이벤트 발생.
 
//----------------------------------------------
//  무효 판정 문턱값. 측정값이 아래 문턱값보다 낮으면 무시함.
const int THRESHOLD_SUM_row_1st   = 60;   // 1st row, front row
const int THRESHOLD_SUM_row_3rd   = 60;   // 3rd row, back row
const int THRESHOLD_SUM_row_2nd   = 90;  // 2nd row, left and right
const int THRESHOLD_SUM_VERT      = 60; // SUM? PRESSURE?
//----------------------------------------------
//  상수 - 방석의 셀 개수
const int CONST_SEAT_CELL_NUM_TOTAL = 31; // Total number of sensor cells = 31.
const int CONST_SEAT_CELL_NUM_ROW_1ST = 6;
const int CONST_SEAT_CELL_NUM_ROW_2ND = 15;
const int CONST_SEAT_CELL_NUM_ROW_3RD = 10;


//  adc data buffer
const int NUM_OF_CH = 32;
//int sensor_data[NUM_OF_CH];
 
// Pressure Center Position (X:cop_horizon, Y:cop_vertical)
float cop_horizon = 0.0;
float cop_vertical = 0.0;

//자세 타입 위:1, 아래:2, 좌:3, 우:4, 왼쪽다리꼼:5, 오른쪽다리꼼:6
int pos_type = 0;


void setup() {
  pinMode(En0, OUTPUT);
  pinMode(En1, OUTPUT);
 
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT); 
  
  Serial.begin(115200);
  Serial1.begin(9600);
}
 
 
void loop() { 
  int sum = 0;
  //  read adc value. scan 32 channels of shield.
  for(int ch = 0 ; ch < NUM_OF_CH ; ch++){ 
    //sensor_data[ch] = readMux(ch);
    sum += adc_value[ch] = readMux(ch);
  }
  pos_type = 0;
  cal_horizon();
  cal_vertical();


  if(cop_horizon == 0.00 && cop_vertical == 0.00 || sum < 100) {
    Serial1.print("부재중");
  }
  else{
    int a = 0, b = 0;
  int left_twisted_sum = adc_value[10] + adc_value[12] + adc_value[14];
  double left_twisted = left_twisted_sum / (double)3;
  if(left_twisted <= 20) a = 1;

  int right_twisted_sum = adc_value[16] + adc_value[18] + adc_value[20];
  double right_twisted = right_twisted_sum / (double)3;
  if(right_twisted <= 25) b = 1;

  if(a==1 && b == 0) pos_type = 5;//왼쪽 다리꼼
  else if(a==0 && b == 1) pos_type = 6; // 오른쪽 다리 꼼
  
  if(pos_type <= 4){
    //앞, 뒤 쏠림
   if(THRESHOLD_COP_forth < cop_vertical) {
       pos_type = 1;
   }
   else if(cop_vertical < THRESHOLD_COP_back) {
       pos_type = 2;
   }

   //좌, 우 쏠림
   //press left
   else if(cop_horizon < THRESHOLD_COP_left) {
       pos_type = 3;
   }
   //  press right
   else if(THRESHOLD_COP_right < cop_horizon) {
       pos_type = 4;  
   }   
  }  
  //  print to serial port
  for(int ch = 0; ch < NUM_OF_CH; ch++){ 
    Serial.print(adc_value[ch]);
    Serial.print(",");  // comma is used as a delimiter.
    //Serial1.print(sensor_data[ch]);
  }
  Serial.println(" ");

  
  if(pos_type == 0) Serial1.print("정자세");
  else if(pos_type==1) Serial1.print("앞");
  else if(pos_type==2) Serial1.print("뒤");
  else if(pos_type==3) Serial1.print("왼쪽");
  else if(pos_type==4) Serial1.print("오른쪽");
  else if(pos_type==5) Serial1.print("왼쪽 다리 꼼");
  else if(pos_type==6) Serial1.print("오른쪽 다리 꼼");

  //Serial.println(pos_type);
  //Serial1.println(pos_type);
  //Serial1.print(">");
  //Serial1.print(cop_horizon);
  //Serial1.print(",");
  //Serial1.println(cop_vertical);
  //Serial1.println(" ");  // end of line. carriage return.

  
 // Serial1.print(pos_type);
  }
 
 
  delay(1000); // sleep for 10 milli seconds. It slow down the speed. You can delete this line.
}
 

int readMux(int channel){
 
  int muxChannel[NUM_OF_CH][6]={ //  6 means number of digital control pins for 2 mux ic.
    //  {S0,S1,S2,S3,En0,En1}
    {0,0,0,0,0,1}, //channel 0. '0': pin out low, 1 : pin out high. 
    {0,0,0,1,0,1}, //channel 1 It means S0=0, S1=0, S2=0, S3=1, En0=0, En1=1
    {0,0,1,0,0,1}, //channel 2
    {0,0,1,1,0,1}, //channel 3
    {0,1,0,0,0,1}, //channel 4
    {0,1,0,1,0,1}, //channel 5
    {0,1,1,0,0,1}, //channel 6
    {0,1,1,1,0,1}, //channel 7
    {1,0,0,0,0,1}, //channel 8
    {1,0,0,1,0,1}, //channel 9
    {1,0,1,0,0,1}, //channel 10
    {1,0,1,1,0,1}, //channel 11
    {1,1,0,0,0,1}, //channel 12. It means S0=1, S1=1, S2=0, S3=0, En0=0, En1=1
    {1,1,0,1,0,1}, //channel 13
    {1,1,1,0,0,1}, //channel 14
    {1,1,1,1,0,1}, //channel 15
    {0,0,0,0,1,0}, //channel 16
    {0,0,0,1,1,0}, //channel 17
    {0,0,1,0,1,0}, //channel 18
    {0,0,1,1,1,0}, //channel 19
    {0,1,0,0,1,0}, //channel 20
    {0,1,0,1,1,0}, //channel 21. It means S0=0, S1=1, S2=0, S3=1, En0=1, En1=0
    {0,1,1,0,1,0}, //channel 22
    {0,1,1,1,1,0}, //channel 23
    {1,0,0,0,1,0}, //channel 24
    {1,0,0,1,1,0}, //channel 25
    {1,0,1,0,1,0}, //channel 26
    {1,0,1,1,1,0}, //channel 27
    {1,1,0,0,1,0}, //channel 28
    {1,1,0,1,1,0}, //channel 29
    {1,1,1,0,1,0}, //channel 30
    {1,1,1,1,1,0}  //channel 31
  };
 
 
  // config 6 digital out pins of 2 mux ic.
  for(int i = 0; i < 6; i ++){
    digitalWrite(controlPin[i], muxChannel[channel][i]);
  }
 
  //read sensor value
  int adc_value = analogRead(ADC_pin);
 
  return adc_value;
}

void cal_horizon(){
  //---------------------------------------------------------
 //     2번 줄의 측정값으로 무게 중심의 X 좌표 계산하기
 //---------------------------------------------------------
  int sum_row_2nd =  adc_value[5]+adc_value[6]+adc_value[7]+adc_value[8]+adc_value[9]
                    +adc_value[11]+adc_value[13]+adc_value[15]+adc_value[17]+adc_value[19]
                    +adc_value[21]+adc_value[22]+adc_value[23]+adc_value[24]+adc_value[25];
 
  //  센서 2 번째 줄의 15개 센서의 측정값에 위치별 가중치(-7~7))를 부여하여 더합니다. 
  //  그것을 7로 나눠서 좌표 범위를 -1~1 로 한정합니다.
  int sum_wp_horizon = (  (-7)*adc_value[5]+(-6)*adc_value[6]+(-5)*adc_value[7]
                          +(-4)*adc_value[8]+(-3)*adc_value[9]+(-2)*adc_value[11]
                          +(-1)*adc_value[13]+(0)*adc_value[15]
                          +(1)*adc_value[17]+(2)*adc_value[19]+(3)*adc_value[21]
                          +(4)*adc_value[22]+(5)*adc_value[23]+(6)*adc_value[24]
                          +(7)*adc_value[25] ) / 7.0; // divide 7.0 ==> unitize. (-7.0~7.0)
 
  cop_horizon = 0.0;
  //  무게 중심의 X 좌표 계산
  if(0 < sum_row_2nd) {
    cop_horizon = sum_wp_horizon / (double)sum_row_2nd;
  }
}

void cal_vertical(){
  //---------------------------------------------------------
 //     1, 3번 줄의 측정값으로 무게 중심의 Y 좌표 계산하기
 //---------------------------------------------------------
  int sum_row_1st = adc_value[10]+adc_value[12]+adc_value[14]+adc_value[16]+adc_value[18]+adc_value[20];
 
  int sum_row_3rd =   adc_value[0]+adc_value[1]+adc_value[2]+adc_value[3]+adc_value[4]
                    +adc_value[26]+adc_value[27]+adc_value[28]+adc_value[29]+adc_value[30];
 
  int sum_vertical = sum_row_1st + sum_row_3rd;
 
  double avg_row_1st = sum_row_1st / CONST_SEAT_CELL_NUM_ROW_1ST;
  double avg_row_3rd = sum_row_3rd / CONST_SEAT_CELL_NUM_ROW_3RD;
 
  //  무게 중심의 Y 좌표 계산
  cop_vertical = 0.0;
  if( 0 < sum_vertical) {
    cop_vertical = (avg_row_1st * (1) + avg_row_3rd * (-1)) / (avg_row_1st + avg_row_3rd);
  }  
}
