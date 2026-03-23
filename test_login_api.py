import requests

url = "http://127.0.0.1:8000/api/login/"
payload = {
    "email": "harmonyproject0312@gmail.com",
    "password": "user123"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
