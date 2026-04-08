import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_workflow():
    print("--- Starting Backend Audit ---")
    
    # 1. Register
    reg_data = {
        "name": "Audit User",
        "email": f"audit_{int(time.time())}@example.com",
        "password": "password123",
        "gender": "Other",
        "age": 30
    }
    r = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    if r.status_code != 200:
        print(f"[FAIL] Registration: {r.text}")
        return
    print("[PASS] Registration successful")
    token = r.json()["token"]

    # 2. Upload with Symptoms
    # Create dummy 1x1 image
    from PIL import Image
    import io
    img = Image.new('RGB', (224, 224), color = 'red')
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)

    symptoms = ["Itching", "Growing in size", "Color Change"]
    files = {'file': ('test.jpg', buf, 'image/jpeg')}
    data = {'symptoms_json': json.dumps(symptoms)}
    headers = {'Authorization': f'Bearer {token}'}

    r = requests.post(f"{BASE_URL}/upload", files=files, data=data, headers=headers)
    if r.status_code != 200:
        print(f"[FAIL] Upload/Scan: {r.text}")
        return
    res = r.json()
    print(f"[PASS] Scan completed: {res['disease']} ({res['risk_level']})")
    if 'metrics' in res:
        print(f"[PASS] ABCDE metrics verified: {list(res['metrics'].keys())}")

    # 3. Admin Audit
    # Default admin credentials
    admin_login = {"email": "admin@skindetect.ai", "password": "Admin@1234"}
    r = requests.post(f"{BASE_URL}/auth/login", json=admin_login)
    if r.status_code != 200:
        print(f"[FAIL] Admin Login: {r.text}")
        return
    admin_token = r.json()["token"]
    print("[PASS] Admin Login successful")

    # Check Admin History for the user
    user_id = res.get('user_id') # Upload return doesn't have user_id currently, let's check /admin/users
    r = requests.get(f"{BASE_URL}/admin/users", headers={'Authorization': f'Bearer {admin_token}'})
    users = r.json().get('users', [])
    target_user = next((u for u in users if u['email'] == reg_data['email']), None)
    
    if not target_user:
        print("[FAIL] Admin could not find the new user")
        return
    print(f"[PASS] Admin detected new user (ID: {target_user['id']})")

    # Check History + Symptoms
    r = requests.get(f"{BASE_URL}/admin/users/{target_user['id']}/history", headers={'Authorization': f'Bearer {admin_token}'})
    history = r.json().get('history', [])
    if len(history) > 0:
        latest = history[0]
        print(f"[PASS] History retrieved. Symptoms persistent: {latest.get('symptoms')}")
        if set(symptoms).issubset(set(latest.get('symptoms'))):
            print("[PASS] Symptom persistence audit: SUCCESS")
        else:
            print("[FAIL] Symptom persistence audit: MISMATCH")
    else:
        print("[FAIL] Admin history returned empty")

if __name__ == "__main__":
    # Ensure backend is running
    try:
        test_workflow()
    except Exception as e:
        print(f"[ERROR] Audit script failed: {e}")
