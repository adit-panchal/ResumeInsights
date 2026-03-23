import os
import django
import pymongo
from dotenv import load_dotenv

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Resumeinsights.settings')
django.setup()

from resumedetails.models import Admin

target_email = "harmonyproject0312@gmail.com"

print(f"Cleaning up databases to keep only: {target_email}")

# 1. Clean Django Database
print("\n--- Cleaning Django Users ---")
users_to_delete = Admin.objects.exclude(email=target_email)
count = users_to_delete.count()
for u in users_to_delete:
    print(f"Deleting user: {u.email} (ID: {u.id})")
    u.delete()

print(f"Deleted {count} users from Django database.")

# 2. Clean MongoDB
print("\n--- Cleaning MongoDB Profiles ---")
load_dotenv()
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
db_name = os.getenv('MONGO_DB_NAME', 'resumeinsights_db')

try:
    client = pymongo.MongoClient(mongo_uri)
    db = client[db_name]
    profiles = db['user_profiles']
    
    # Also clean other related collections if they have email fields
    collections_to_clean = ['user_profiles', 'resumes', 'ats_evaluations']
    
    for coll_name in collections_to_clean:
        coll = db[coll_name]
        result = coll.delete_many({"email": {"$ne": target_email}})
        print(f"Deleted {result.deleted_count} documents from MongoDB collection '{coll_name}'.")

except Exception as e:
    print(f"Error cleaning MongoDB: {e}")

print("\nCleanup complete.")
