import MySQLdb
try:
    conn = MySQLdb.connect(host='localhost', user='root', passwd='jacer@4777', port=3306)
    cursor = conn.cursor()
    cursor.execute('CREATE DATABASE IF NOT EXISTS resumeinsights;')
    print("Database created successfully!")
except Exception as e:
    print("Error:", e)
