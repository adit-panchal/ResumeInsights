import os
import pymongo
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
db_name = os.getenv('MONGO_DB_NAME', 'resumeinsights_db')

print(f"Connecting to MongoDB...")

try:
    client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    db = client[db_name]
    
    # List of logical collections for a Resume Insights application
    collections_to_create = [
        "user_profiles",       # For extended user data, preferences, and settings
        "resumes",             # To store uploaded resume files, metadata, and parsed text
        "ats_evaluations",     # To store ATS scoring results, feedback, and match percentages
        "job_descriptions",    # Target job descriptions for matching against resumes
        "payments_history"     # Record of transactions, premium upgrades, etc.
    ]
    
    existing_collections = db.list_collection_names()
    
    for coll in collections_to_create:
        if coll not in existing_collections:
            # Explicitly creating an empty collection so it appears in Compass
            db.create_collection(coll)
            print(f"  [+] Created collection: {coll}")
        else:
            print(f"  [ ] Collection already exists: {coll}")
            
    # Clean up the dummy table we made earlier
    if 'connection_test' in existing_collections:
        db.drop_collection('connection_test')
        print("  [-] Cleaned up temporary 'connection_test' collection.")
        
    print("\nDatabase initialization complete! You can refresh MongoDB Compass to view your new collections.")
    
except Exception as e:
    print(f"Failed to initialize collections: {e}")
