import os
import pymongo
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
db_name = os.getenv('MONGO_DB_NAME', 'resumeinsights_db')

print(f"Connecting to {mongo_uri}, database: {db_name}...")

try:
    client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    # Check connection
    client.server_info()
    print("Connection successful!")
    
    db = client[db_name]
    
    # MongoDB only creates the database and collection when you actually insert data.
    # We will insert a dummy document to force the creation.
    collection = db['connection_test']
    result = collection.insert_one({"message": "MongoDB is successfully connected!"})
    
    print(f"Inserted dummy document with ID: {result.inserted_id}")
    print(f"The database '{db_name}' should now be visible in MongoDB Compass!")
    
except Exception as e:
    print(f"Failed to connect or insert: {e}")
