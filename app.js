// app.js - 디버깅 테스트 추가
import { SXCamera } from './lib/sx-camera.js';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { Gpio } from 'onoff';


const cameraPowerPin = new Gpio(532, 'out'); // weired numbering now for gpio 20 //TODO

/**
 * 현재 시간을 포맷된 문자열로 반환하는 함수
 */
function getFormattedTime() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
}

function getEpochTimestamp() {
  return Math.floor(Date.now() / 1000);
}

function getReadableTimestamp() {
  const now = new Date();
  return now.toISOString().slice(0, 16).replace('T', '-').replace(':', '-');
}
  // 나머지 함수들은 동일...
  async function delay(ms) 
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


/**
 * Starlight Xpress 카메라 테스트 함수
 */
export async function saveSXCamera(exposureTime) {
  // 카메라 객체 생성
  const camera = new SXCamera();
  
  try {
    console.log('Starlight Xpress 카메라 테스트 시작');

    cameraPowerPin.writeSync(1);
    console.log(`camera power on`);
    await delay(3000);
    

    // 카메라 연결
    console.log('카메라 연결 시도...');
    const connected = camera.connect();
    
    if (!connected) {
      console.error('카메라 연결 실패:', camera.getLastError());
      return;
    }
    
    console.log('카메라 연결 성공!');
    
    // 카메라 정보 가져오기
    try {
      const cameraInfo = camera.getCameraInfo();
      console.log('카메라 정보:');
      console.log(` - 모델: ${cameraInfo.model} (코드: ${cameraInfo.modelCode})`);
      console.log(` - 펌웨어 버전: ${cameraInfo.firmwareVersion}`);
    } catch (error) {
      console.error('카메라 정보 가져오기 실패:', error.message);
    }
    
    // 이미지 캡처
    //const exposureTime = 5.0; //  노출
    console.log(`이미지 캡처 시작 (노출 시간: ${exposureTime}초)...`);
    
// 이미지 저장 부분 수정
try {
  const image = camera.captureImage(exposureTime);
  console.log(`이미지 캡처 완료: ${image.width}x${image.height}, ${image.bitsPerPixel}비트`);
  
  // 이미지 저장 디렉토리 생성
  const imagesDir = 'images';
  await mkdir(imagesDir, { recursive: true });

  const dataDir = 'data';
  await mkdir(dataDir, { recursive: true });
  
  // 타임스탬프를 이용한 파일명 생성
  //const timestamp = getFormattedTime();
  const epoch = getEpochTimestamp();
  const readable = getReadableTimestamp();
  
  // JPG 형식으로 저장 (명암 스트레칭 및 90% 품질)
  const jpgFilename = join(imagesDir, `${epoch}.jpg`);
  await camera.saveAsJPG(image, jpgFilename, { quality: 90, stretch: true });
  console.log(`이미지가 저장되었습니다: ${jpgFilename}`);

  const fitsFilename = join(dataDir, `${epoch}.fits`);
  // FITS 형식으로 저장
  await camera.saveAsFits(image, fitsFilename);
  console.log(`이미지가 저장되었습니다: ${fitsFilename}`);

  cameraPowerPin.writeSync(0);
  console.log(`camera power off`);

  return { epoch, readable, jpg: `${epoch}.jpg`, fits: `${epoch}.fits` };


} catch (error) {
  console.error('이미지 캡처 실패:', error);
}
    
    
  }  finally {
    if (camera.isConnected()) camera.disconnect();
    console.log('카메라 연결 해제...');

    cameraPowerPin.writeSync(0);
  }
}

/**
 * 카메라 디버깅 테스트 함수
 */
async function testDebugCamera() {
  try {
    console.log('카메라 디버깅 테스트 시작');
    
    // 카메라 객체 생성
    const camera = new SXCamera();
    
    // 카메라 연결
    console.log('카메라 연결 시도...');
    const connected = camera.connect();
    
    if (!connected) {
      console.error('카메라 연결 실패:', camera.getLastError());
      return;
    }
    
    console.log('카메라 연결 성공!');
    
    // 디버그 함수 호출
    console.log('카메라 디버깅 함수 호출...');
    try {
      const result = camera.debugCamera();
      console.log('디버깅 결과:', result ? '성공' : '실패');
    } catch (error) {
      console.error('디버깅 중 오류 발생:', error);
    }
    
    // 카메라 연결 해제
    console.log('카메라 연결 해제...');
    camera.disconnect();
    console.log('디버깅 테스트 완료');
    
  } catch (error) {
    console.error('예기치 않은 오류:', error);
  }
}

// 테스트 실행
//saveSXCamera(5.0);  // 주석 처리
//testDebugCamera();  // 디버깅 테스트 실행