// 의료진 화면 → 환자 화면으로 메시지 전송
function send(message) {
    localStorage.setItem('doctor_message', message);
    localStorage.setItem('doctor_time', Date.now());
    document.getElementById('received') &&
      (document.getElementById('received').innerText = '전송됨: ' + message);
}

// 환자 화면 → 의료진 화면으로 수어 인식 결과 전송
function sendPatient(message) {
    localStorage.setItem('patient_message', message);
    localStorage.setItem('patient_time', Date.now());
}

// 실시간으로 상대방 메시지 감지
window.addEventListener('storage', function(e) {

    // 환자 화면에서 의료진 메시지 수신
    if (e.key === 'doctor_message') {
        const el = document.getElementById('received');
        if (el) el.innerText = e.newValue;
    }

    // 의료진 화면에서 환자 메시지 수신
    if (e.key === 'patient_message') {
        const el = document.getElementById('received');
        if (el) el.innerText = e.newValue;
    }
});

// 카메라 + MediaPipe 연결
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