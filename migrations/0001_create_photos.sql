CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  -- GPS 정보 (없으면 NULL)
  has_gps INTEGER DEFAULT 0,
  lat REAL,
  lng REAL,
  taken_at TEXT,
  -- 사진 분류 (real: 현실 공간, virtual: 게임 등 가상 공간)
  space_type TEXT DEFAULT 'real',
  -- Phase 2에서 추가될 포인트클라우드 파일 URL
  point_cloud_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
