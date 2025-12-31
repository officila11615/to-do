from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
from datetime import datetime, date

app = Flask(__name__, template_folder='api/templates', static_folder='api/templates/static')
app.secret_key = 'task_reminder_secret'

def get_db_connection():
    con = sqlite3.connect('tasks.db')
    con.row_factory = sqlite3.Row
    return con

@app.route('/', methods=['GET', 'POST'])
def index():
    con = get_db_connection()
    
    if request.method == 'POST':
        title = request.form['title']
        description = request.form.get('description', '')
        due_date = request.form['due_date']
        
        c = con.cursor()
        c.execute("INSERT INTO tasks (title, description, due_date, completed) VALUES (?, ?, ?, 0)",
                  (title, description, due_date))
        con.commit()
        con.close()
        flash('Task added successfully!')
        return redirect(url_for('index'))
    
    # Get all tasks, order by due_date
    c = con.cursor()
    tasks = c.execute("SELECT * FROM tasks ORDER BY due_date ASC").fetchall()
    con.close()
    
    return render_template('index.html', tasks=tasks)

@app.route('/complete/<int:id>')
def complete(id):
    con = get_db_connection()
    c = con.cursor()
    c.execute("UPDATE tasks SET completed = 1 WHERE id = ?", (id,))
    con.commit()
    con.close()
    flash('Task marked as complete!')
    return redirect(url_for('index'))

@app.route('/delete/<int:id>')
def delete(id):
    con = get_db_connection()
    c = con.cursor()
    c.execute("DELETE FROM tasks WHERE id = ?", (id,))
    con.commit()
    con.close()
    flash('Task deleted!')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
