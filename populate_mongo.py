import os
import pymongo
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
db_name = os.getenv('MONGO_DB_NAME', 'resumeinsights_db')

print(f"Connecting to MongoDB at {mongo_uri}...")

try:
    client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    db = client[db_name]
    
    # 1. Populate user_profiles
    user_profiles = db['user_profiles']
    if user_profiles.count_documents({}) == 0:
        sample_users = [
            {
                "email": "harmonyproject0312@gmail.com",
                "name": "Adit Panchal",
                "phone": "+91 9876543210",
                "address": "Mumbai, India",
                "plan": "premium",
                "created_at": datetime.now(),
                "preferences": {
                    "accentColor": "#00e7ed",
                    "fontSize": "medium"
                }
            },
            {
                "email": "testuser@example.com",
                "name": "Test User",
                "phone": "+1 234 567 8900",
                "address": "New York, USA",
                "plan": "free",
                "created_at": datetime.now(),
                "preferences": {
                    "accentColor": "#ff6b6b",
                    "fontSize": "large"
                }
            }
        ]
        user_profiles.insert_many(sample_users)
        print("  [+] Inserted sample user_profiles")

    # 2. Populate resumes
    resumes = db['resumes']
    if resumes.count_documents({}) == 0:
        sample_resumes = [
            {
                "user_email": "harmonyproject0312@gmail.com",
                "filename": "Adit_Panchal_Resume.pdf",
                "upload_date": datetime.now(),
                "parsed_text": "Experienced Software Engineer with a background in Python, Django, React, and MongoDB. Strong problem-solving skills...",
                "metadata": {
                    "skills": ["Python", "Django", "React", "MongoDB", "JavaScript"],
                    "education": "B.Tech in Computer Science",
                    "experience_years": 3
                }
            }
        ]
        resumes.insert_many(sample_resumes)
        print("  [+] Inserted sample resumes")

    # 3. Populate job_descriptions
    job_descriptions = db['job_descriptions']
    if job_descriptions.count_documents({}) == 0:
        sample_jobs = [
            {
                "title": "Full Stack Developer",
                "company": "Tech Innovations Inc.",
                "description": "We are looking for a Full Stack Developer proficient in React on the frontend and Python/Django on the backend. Experience with MongoDB is a plus. The ideal candidate will have 3+ years of experience building scalable web applications.",
                "required_skills": ["React", "Python", "Django", "MongoDB", "REST APIs"],
                "added_by": "harmonyproject0312@gmail.com",
                "created_at": datetime.now()
            }
        ]
        job_descriptions.insert_many(sample_jobs)
        print("  [+] Inserted sample job_descriptions")

    # 4. Populate ats_evaluations
    ats_evaluations = db['ats_evaluations']
    if ats_evaluations.count_documents({}) == 0:
        # Get the IDs of the inserted documents to link them
        resume_doc = resumes.find_one({"user_email": "harmonyproject0312@gmail.com"})
        job_doc = job_descriptions.find_one({"title": "Full Stack Developer"})
        
        if resume_doc and job_doc:
            sample_evaluations = [
                {
                    "user_email": "harmonyproject0312@gmail.com",
                    "resume_id": resume_doc["_id"],
                    "job_id": job_doc["_id"],
                    "evaluation_date": datetime.now(),
                    "overall_score": 85,
                    "keyword_match_score": 90,
                    "experience_match_score": 80,
                    "feedback": {
                        "strengths": ["Strong match for Python and Django", "React experience aligns well"],
                        "weaknesses": ["Consider highlighting REST API experience more explicitly"],
                        "missing_keywords": ["REST APIs"]
                    }
                }
            ]
            ats_evaluations.insert_many(sample_evaluations)
            print("  [+] Inserted sample ats_evaluations")

    # 5. Populate payments_history
    payments_history = db['payments_history']
    if payments_history.count_documents({}) == 0:
        sample_payments = [
            {
                "user_email": "harmonyproject0312@gmail.com",
                "transaction_id": "TXN987654321",
                "amount": 19.99,
                "currency": "USD",
                "plan_purchased": "Premium Monthly",
                "payment_date": datetime.now(),
                "status": "completed"
            }
        ]
        payments_history.insert_many(sample_payments)
        print("  [+] Inserted sample payments_history")

    print("\nSuccessfully populated MongoDB collections with sample data!")
    
except Exception as e:
    print(f"Failed to populate collections: {e}")
