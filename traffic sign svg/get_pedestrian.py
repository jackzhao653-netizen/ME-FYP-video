import urllib.request
import json
import urllib.parse
import sys

def download_wiki_svg(filename, out_name):
    encoded_name = urllib.parse.quote(filename)
    api_url = "https://commons.wikimedia.org/w/api.php?action=query&titles=" + encoded_name + "&prop=imageinfo&iiprop=url&format=json"
    try:
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        pages = data['query']['pages']
        for page_id in pages:
            if 'imageinfo' in pages[page_id]:
                url = pages[page_id]['imageinfo'][0]['url']
                print("Found URL:", url)
                
                req_file = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                resp_file = urllib.request.urlopen(req_file)
                with open(out_name, 'wb') as f:
                    f.write(resp_file.read())
                
                print("Downloaded", out_name)
                return True
    except Exception as e:
        print("Error fetching", filename, e)
    return False

# The Russian 5.19.2 is much cleaner and universally recognized than the Polish one.
signs = [
    "File:RU_road_sign_5.19.2.svg"
]

for sign in signs:
    if download_wiki_svg(sign, "pedestrian_crossing.svg"):
        break
