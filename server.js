import express from 'express';
import Database from 'better-sqlite3';
import { mkdir } from 'fs/promises';
import { saveSXCamera } from './app.js';
import cron from 'node-cron';


const app = express();
const db = new Database('captures.db');

await mkdir('images', { recursive: true });
await mkdir('data', { recursive: true });

// 실행 상태 추적
let isRunning = false;
let currentSchedule = null;
let cronJob = null;
let runningProgress = { current: 0, total: 0, startTime: null };

db.exec(`
  CREATE TABLE IF NOT EXISTS captures (
    epoch INTEGER PRIMARY KEY,
    readable TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use('/images', express.static('images'));
app.use('/data', express.static('data'));

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 촬영 실행 함수
async function executeCapture(exposure, howmany, interval) {
  if (isRunning) {
    console.log('이미 촬영 중입니다. 스킵합니다.');
    return { success: false, message: '이미 촬영 중입니다' };
  }

  isRunning = true;
  runningProgress = { current: 0, total: howmany, startTime: Date.now() };
  const results = [];

  try {
    for (let i = 0; i < howmany; i++) {
      runningProgress.current = i + 1;
      console.log(`촬영 ${i + 1}/${howmany} 시작`);
      
      const result = await saveSXCamera(exposure);
      db.prepare('INSERT INTO captures (epoch, readable) VALUES (?, ?)').run(result.epoch, result.readable);
      
      results.push(result);
      console.log(`촬영 ${i + 1} 완료: ${result.epoch}`);
      
      if (i < howmany - 1 && interval > 0) {
        await delay(interval * 1000);
      }
    }
    
    return { success: true, count: howmany, files: results };
    
  } catch (error) {
    console.error('촬영 오류:', error.message);
    return { success: false, error: error.message };
  } finally {
    isRunning = false;
    runningProgress = { current: 0, total: 0, startTime: null };
  }
}


app.get('/api/capture', async (req, res) => {
  const exposure = parseFloat(req.query.exposure) || 5.0;
  const howmany = parseInt(req.query.howmany) || 1;
  const interval = parseFloat(req.query.interval) || 0;
  const schedule = req.query.schedule;
// 스케줄 등록
  if (schedule) {
    try {
      // 기존 스케줄 중지
      if (cronJob) {
        cronJob.destroy();
      }

      // 새 스케줄 등록
      cronJob = cron.schedule(schedule.replace(/\+/g, ' '), async () => {
        console.log(`스케줄 실행: ${new Date().toISOString()}`);
        await executeCapture(exposure, howmany, interval);
      }, { scheduled: false });

      cronJob.start();

      currentSchedule = {
        cron: schedule.replace(/\+/g, ' '),
        exposure,
        howmany,
        interval,
        createdAt: new Date().toISOString()
      };

      res.json({ 
        success: true, 
        message: '스케줄이 등록되었습니다',
        schedule: currentSchedule
      });

    } catch (error) {
      res.status(400).json({ success: false, error: '잘못된 cron 형식입니다' });
    }
  } else {
    // 즉시 촬영
    const result = await executeCapture(exposure, howmany, interval);
    res.json(result);
  }
  
});

// 스케줄 조회/삭제
app.get('/api/schedule', (req, res) => {
  const action = req.query.action;

  if (action === 'delete') {
    if (cronJob) {
      cronJob.destroy();
      cronJob = null;
      currentSchedule = null;
      res.json({ success: true, message: '스케줄이 삭제되었습니다' });
    } else {
      res.json({ success: false, message: '삭제할 스케줄이 없습니다' });
    }
  } else {
    if (currentSchedule) {
      res.json({
        active: true,
        ...currentSchedule,
        nextRun: cronJob ? '계산됨' : null // cron 라이브러리에서 다음 실행 시간 계산 가능
      });
    } else {
      res.json({ active: false });
    }
  }
});

// 상태 조회
app.get('/api/status', (req, res) => {
  const response = {
    running: isRunning,
    schedule: currentSchedule ? {
      active: true,
      cron: currentSchedule.cron
    } : { active: false }
  };

  if (isRunning) {
    const elapsedMs = Date.now() - runningProgress.startTime;
    response.progress = `${runningProgress.current}/${runningProgress.total}`;
    response.elapsedSeconds = Math.floor(elapsedMs / 1000);
  }

  res.json(response);
});

app.get('/api/captures', (req, res) => {
  const { from, to } = req.query;
  let query = 'SELECT epoch, readable FROM captures';
  let params = [];
  
  if (from || to) {
    query += ' WHERE';
    
    if (from) {
      // 숫자면 epoch, 문자열이면 readable로 검색
      if (isNaN(from)) {
        query += ' readable >= ?';
        params.push(from);
      } else {
        query += ' epoch >= ?';
        params.push(parseInt(from));
      }
    }
    
    if (to) {
      if (from) query += ' AND';
      
      if (isNaN(to)) {
        query += ' readable <= ?';
        params.push(to);
      } else {
        query += ' epoch <= ?';
        params.push(parseInt(to));
      }
    }
  }
  
  query += ' ORDER BY epoch DESC';
  const rows = db.prepare(query).all(params);
  const files = rows.map(row => ({
    epoch: row.epoch,
    readable: row.readable,
    jpg: `${row.epoch}.jpg`,
    fits: `${row.epoch}.fits`
  }));
  
  res.json(files);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
