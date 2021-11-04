#pip install requests
import requests
import time
import json

json_hakgwa = open('hakgwa.json', 'r', encoding="utf-8").read()
data = json.loads(json_hakgwa)
temp = []
for a in data:
    temp.append(a)

print(temp)
