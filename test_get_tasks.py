import urllib.request, json, urllib.parse
req = urllib.request.Request("http://localhost:8000/login", data=urllib.parse.urlencode({"username": "antigravity@gmail.com", "password": "12345"}).encode(), headers={"Content-Type": "application/x-www-form-urlencoded"})
with urllib.request.urlopen(req) as res:
    token = json.loads(res.read())["access_token"]
    
req2 = urllib.request.Request("http://localhost:8000/tasks/project/2", headers={"Authorization": f"Bearer {token}"})
try:
    with urllib.request.urlopen(req2) as res2:
        print(res2.read().decode())
except urllib.error.HTTPError as e:
    print(e.read().decode())
