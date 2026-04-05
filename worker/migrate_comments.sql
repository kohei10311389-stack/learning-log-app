CREATE TABLE comments_new (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id    INTEGER NOT NULL,
  content    TEXT    NOT NULL,
  type       TEXT    NOT NULL CHECK(type IN ('instructor', 'manager', 'self', 'anonymous')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
INSERT INTO comments_new SELECT * FROM comments;
DROP TABLE comments;
ALTER TABLE comments_new RENAME TO comments;
