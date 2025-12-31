import sqlite3

con = sqlite3.connect('tasks.db')
con.row_factory = sqlite3.Row
c = con.cursor()


c.execute('''CREATE TABLE IF NOT EXISTS tasks
             (id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              description TEXT,
              due_date DATE,
              completed INTEGER DEFAULT 0)''')

con.commit()
con.close()
print("✅ Database ready! tasks.db created.")
