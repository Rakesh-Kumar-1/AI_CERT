CREATE TABLE IF NOT EXISTS chat (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  userid INT,
  addedwords TEXT[],
  removedwords TEXT[],
  oldlength INT,
  newlength INT,
  text TEXT NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);
