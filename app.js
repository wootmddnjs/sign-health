// Firebase 초기화
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtzt-_sU8254xSSJ29jnNNpRKZz3X5nMs",
  authDomain: "sign-health.firebaseapp.com",
  databaseURL: "https://sign-health-default-rtdb.firebaseio.com",
  projectId: "sign-health",
  storageBucket: "sign-health.firebasestorage.app",
  messagingSenderId: "117629635026",
  appId: "1:117629635026:web:9d0e632ae33bec361fa00b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 의료진 → 환자 메시지 전송
function send(message) {
  set(ref(db, 'doctor_message'), {
    text: message,
    time: Date.now()
  });
  const el = document.getElementById('received');
  if (el) el.innerText = '전송됨: ' + message;
}

// 환자 수어 인식 결과 전송
function sendPatient(message) {
  set(ref(db, 'patient_message'), {
    text: message,
    time: Date.now()
  });
}

// 의료진 화면 — 환자 메시지 수신
const receivedEl = document.getElementById('received');
if (receivedEl && document.title === '의료진 화면') {
  onValue(ref(db, 'patient_message'), (snapshot) => {
    const data = snapshot.val();
    if (data) receivedEl.innerText = data.text;
  });
}

// 환자 화면 — 의료진 메시지 수신
if (receivedEl && document.title === '환자 화면') {
  onValue(ref(db, 'doctor_message'), (snapshot) => {
    const data = snapshot.val();
    if (data) receivedEl.innerText = data.text;
  });
}

// MediaPipe 카메라 연결
const videoEl = document.getElementById('camera');

if (videoEl) {
  const hands = new Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.5
  });

  hands.onResults((results) => {
    const el = document.getElementById('recognized');
    if (results.landmarks && results.landmarks.length > 0) {
      el.innerText = '손 인식됨 ✋';
      el.style.color = '#2b6cb0';
    } else {
      el.innerText = '인식 대기 중...';
      el.style.color = '#c53030';
    }
  });

  const camera = new Camera(videoEl, {
    onFrame: async () => {
      await hands.send({ image: videoEl });
    },
    width: 320,
    height: 240
  });

  camera.start();
}