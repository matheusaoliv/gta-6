"""Gera os blocos e os dados do mapa de Leonida (mapa.html) a partir do repositório
github.com/rolux/gtadb.org (GTA VI Mapping Community, dados e imagens CC BY 4.0).

Uso:  python3 tools/build-mapa.py <caminho-do-clone-gtadb.org>

- Blocos: maps/tiles/6/day, níveis 0 a 6 (o 6 tem 2 px por unidade do jogo), convertidos para WebP. Blocos só de mar
  (uma cor só) são descartados; o mapa pinta o mar com a cor de fundo.
- Dados: map/data/6/landmarks.json, compactado e com categorias em português.
"""
import json
import os
import re
import sys

from concurrent.futures import ProcessPoolExecutor

from PIL import Image, ImageStat

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'mapa')
MAX_Z = 6

# ---------------------------------------------------------------- blocos
def convert(job):
    """Converte um bloco; devolve (x, y) ou None se for só mar."""
    z, f = job
    y, x = map(int, re.match(r'\d+,(\d+),(\d+)\.jpg$', f).groups())
    im = Image.open(os.path.join(SRC, 'maps/tiles/6/day', str(z), f)).convert('RGB')
    if max(ImageStat.Stat(im).stddev) < 3:  # mar liso: vira cor de fundo
        return None
    out = os.path.join(OUT, 'tiles', str(z), f'{x}_{y}.webp')
    if not os.path.exists(out):
        im.save(out, 'WEBP', quality=74, method=6)
    return (x, y)


tiles = {}
pool = ProcessPoolExecutor()
for z in range(MAX_Z + 1):
    d = os.path.join(SRC, 'maps/tiles/6/day', str(z))
    os.makedirs(os.path.join(OUT, 'tiles', str(z)), exist_ok=True)
    keep = [k for k in pool.map(convert, [(z, f) for f in sorted(os.listdir(d))], chunksize=64) if k]
    # índice compacto: por linha y, intervalos [x0, x1] contíguos
    rows = {}
    for x, y in keep:
        rows.setdefault(y, []).append(x)
    packed = []
    for y in sorted(rows):
        xs = sorted(rows[y])
        runs = [y]
        start = prev = xs[0]
        for x in xs[1:]:
            if x != prev + 1:
                runs += [start, prev]
                start = x
            prev = x
        runs += [start, prev]
        packed.append(runs)
    tiles[z] = packed
    print('z', z, len(keep), 'blocos')

# ---------------------------------------------------------------- categorias
# etiqueta "#servico" do jogo tem prioridade; depois o tipo do prédio
SERVICE = {
    'safehouse': 'safehouse',
    'gas': 'auto', 'modshop': 'auto', "pay'n'spray": 'auto', 'carwash': 'auto', 'bikeshop': 'auto',
    'guns': 'guns', 'fence': 'guns',
    'clothes': 'style', 'shoes': 'style', 'hair': 'style', 'tattoos': 'style',
    'supermarket': 'shops', 'electronics': 'shops', 'vendor': 'shops', 'liquor': 'shops', 'pharmacy': 'shops',
    'food': 'food', 'fastfood': 'food', 'bar': 'food', 'drinks': 'food', 'nightclub': 'food', 'stripclub': 'food',
    'airport': 'transit', 'airbase': 'transit', 'train': 'transit', 'metro': 'transit', 'metromover': 'transit',
    'bus': 'transit', 'marina': 'transit', 'blimp': 'transit',
    'police': 'emergency', 'hospital': 'emergency', 'jail': 'emergency',
    'racetrack': 'fun', 'tennis': 'fun', 'golf': 'fun', 'gym': 'fun', 'volleyball': 'fun', 'cinema': 'fun', 'ferriswheel': 'fun',
}
TYPE = {
    'hotel': 'hotel', 'restaurant': 'food', 'fastfood': 'food',
    'retail': 'shops', 'supermarket': 'shops',
    'leisure': 'fun', 'events': 'fun', 'recreation': 'fun',
    'landmark': 'landmark', 'point-of-interest': 'landmark',
    'natural': 'nature', 'agriculture': 'nature',
    'transportation': 'transit',
    'government': 'public', 'public': 'public',
    'industrial': 'industry', 'utilities': 'industry', 'construction': 'industry', 'service': 'industry',
    'office': 'office', 'residential': 'home',
}
FLAGS = {'enterable': 1, 'unconfirmed': 2, 'demolished': 4, 'closed': 8, 'reused': 16, 'mirrored': 32}

data = json.load(open(os.path.join(SRC, 'map/data/6/landmarks.json')))
photos = set()
for root, _, files in os.walk(os.path.join(SRC, 'map/photos/6')):
    photos.update(files)
if not photos:  # clone parcial: a lista vem do índice do git
    import subprocess
    out = subprocess.run(['git', '-C', SRC, 'ls-tree', '-r', '--name-only', 'HEAD', 'map/photos/6'],
                         capture_output=True, text=True).stdout
    photos = {p.rsplit('/', 1)[-1] for p in out.split()}

places = []
for lid, v in data.items():
    if len(v) < 2 or not v[1]:
        continue  # sem posição no jogo
    tags = v[6] if len(v) > 6 else []
    cat = next((SERVICE[t[1:]] for t in tags if t.startswith('#') and t[1:] in SERVICE), None)
    cat = cat or next((TYPE[t] for t in tags if t in TYPE), 'other')
    flags = sum(FLAGS[t] for t in tags if t in FLAGS)
    parts = v[0].split(', ')
    name = '' if parts[0].startswith('?') else parts[0]  # '?', '? (N)': ainda sem nome no jogo
    area = ', '.join(parts[1:])
    real = v[3] if len(v) > 3 else ''
    ll = v[4] if len(v) > 4 and v[4] else []
    ph = (1 if f'{lid},ig.jpg' in photos else 0) | (2 if f'{lid},rl.jpg' in photos else 0)
    places.append([int(lid[1:]), name, area, round(v[1][0], 1), round(v[1][1], 1), cat, flags, real,
                   round(ll[0], 6) if ll else 0, round(ll[1], 6) if ll else 0, ph])

places.sort(key=lambda p: p[0])
json.dump({'tiles': {'maxZoom': MAX_Z, 'rows': tiles}, 'places': places},
          open(os.path.join(OUT, 'mapa.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
cats = {}
for p in places:
    cats[p[5]] = cats.get(p[5], 0) + 1
print(len(places), 'lugares', sorted(cats.items(), key=lambda c: -c[1]))

# auto-checagem: a geometria precisa bater com a do gtadb (zero em 16384, 1 px = 1 unidade no z5)
assert all(-16384 < p[3] < 16384 and -16384 < p[4] < 16384 for p in places)
assert any(p[0] == 25 and p[1] == 'Dominion Hotel' for p in places)
