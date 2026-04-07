import requests
import json
import os

files = {
    "children_crossing.svg": "File:UK_traffic_sign_545.svg",
    "turn_right.svg": "File:UK_traffic_sign_606_(right).svg"
}

def get_wikimedia_url(filename):
    api_url = "https://en.wikipedia.org/w/api.php?action=query&titles=" + filename + "&prop=imageinfo&iiprop=url&format=json"
    r = requests.get(api_url)
    data = r.json()
    pages = data['query']['pages']
    for page_id in pages:
        if 'imageinfo' in pages[page_id]:
            return pages[page_id]['imageinfo'][0]['url']
            
    api_url = "https://commons.wikimedia.org/w/api.php?action=query&titles=" + filename + "&prop=imageinfo&iiprop=url&format=json"
    r = requests.get(api_url)
    data = r.json()
    pages = data['query']['pages']
    for page_id in pages:
        if 'imageinfo' in pages[page_id]:
            return pages[page_id]['imageinfo'][0]['url']
    return None

for local_name, wiki_name in files.items():
    url = get_wikimedia_url(wiki_name)
    if url:
        print("Downloading {} from {}".format(local_name, url))
        r = requests.get(url)
        with open(local_name, 'wb') as f:
            f.write(r.content)
    else:
        print("Failed to find URL for {}".format(wiki_name))

url = get_wikimedia_url("File:Zeichen_350_-_Fußgängerüberweg,_StVO_1992.svg")
if url:
    r = requests.get(url)
    with open("pedestrian_crossing.svg", 'wb') as f:
        f.write(r.content)

stop_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <circle cx="200" cy="200" r="190" fill="#cc0000" stroke="#ffffff" stroke-width="10" />
  <circle cx="200" cy="200" r="195" fill="none" stroke="#000000" stroke-width="2" />
  <text x="200" y="240" font-family="Impact, 'Arial Black', sans-serif" font-weight="900" font-size="130" fill="#ffffff" text-anchor="middle" letter-spacing="-2">STOP</text>
</svg>"""

with open("stop_sign.svg", "w") as f:
    f.write(stop_svg)
print("Created stop_sign.svg manually")
