import pymysql

try:
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='An@291006',
        database='talentiq',
        port=3306
    )
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE candidates ADD COLUMN created_by VARCHAR(255) DEFAULT 'user_admin';")
    conn.commit()
    print("SUCCESS: Added created_by column to MySQL candidates table!")
except Exception as e:
    print("Notice:", e)
