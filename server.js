const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json({ limit: '10mb' }));

// 정적 파일 서빙 (HTML 게임 파일)
app.use(express.static(__dirname));

// 루트 접속 시 게임 파일로 리디렉트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '월드컵_계모임_게임.html'));
});

// ── API: 상태 불러오기 ──
app.get('/api/state', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      res.json({ ok: true, data });
    } else {
      res.json({ ok: true, data: null });
    }
  } catch (e) {
    console.error('읽기 오류:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── API: 상태 저장 ──
app.post('/api/state', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    console.error('저장 오류:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 0.0.0.0 으로 바인딩해야 외부에서 접속 가능
app.listen(PORT, '0.0.0.0', () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let localIp = 'localhost';
  for (const iface of Object.values(nets)) {
    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) {
        localIp = net.address;
        break;
      }
    }
  }

  console.log('');
  console.log('⚽ 2026 월드컵 계모임 서버 시작!');
  console.log('──────────────────────────────────');
  console.log(`🏠 내 컴퓨터:   http://localhost:${PORT}`);
  console.log(`📡 같은 와이파이: http://${localIp}:${PORT}`);
  console.log(`🌐 외부 친구들:  공유기 포트포워딩 후 http://내공인IP:${PORT}`);
  console.log('──────────────────────────────────');
  console.log('서버를 끄려면 Ctrl+C 를 누르세요.');
  console.log('');
});
