"""Download selected Unsplash stock images into assets/stock for self-hosting.
Requires network access; run: python scripts/download_stock_images.py
Only applies to free Unsplash photos. Source list: assets/stock/sources.json.
For rights and restrictions see https://unsplash.com/license and terms.
"""
import json, pathlib, urllib.request
root=pathlib.Path(__file__).resolve().parent.parent
items=json.loads((root/'assets/stock/sources.json').read_text())
for item in items:
    target=root/'assets/stock'/item['file']
    try:
        req=urllib.request.Request(item['source'],headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=25) as response:
            ct=response.headers.get('Content-Type','')
            if 'image/' not in ct:raise ValueError(f'Unexpected content type: {ct}')
            data=response.read()
        if len(data)<10000:raise ValueError('Image response too small')
        target.write_bytes(data)
        print('Downloaded', target.relative_to(root), len(data), 'bytes')
    except Exception as e:
        print('Could not download',item['file'], ':',e)
