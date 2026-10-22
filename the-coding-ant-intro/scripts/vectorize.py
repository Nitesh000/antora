import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage
import potrace

SRC, OUT = sys.argv[1], sys.argv[2]
# K = downsample factor before tracing (1 = faithful pixel-exact, 6 = smoothed curves)
K = int(sys.argv[3]) if len(sys.argv) > 3 else 1
ALPHA = 0.55 if K <= 2 else 1.25  # potrace corner threshold: low keeps the stair corners crisp

m = np.array(Image.open(SRC).convert("RGBA"))[..., 3] > 127
H, W = m.shape
yy, xx = np.mgrid[0:H, 0:W]

# --- split antennae from head ------------------------------------------------
SEAM = 188
BLOCK = (306, 444)  # central top block of the head (stays with the head)
top = m & (yy < SEAM) & ~((xx >= BLOCK[0]) & (xx <= BLOCK[1]))
low = m & (yy >= SEAM)
lab, n = ndimage.label(low)
sizes = ndimage.sum(low, lab, range(1, n + 1))
head_id = int(np.argmax(sizes)) + 1
arms = low & (lab != head_id)
ant = top | arms
antL = ant & (xx < W // 2)
antR = ant & (xx >= W // 2)
head = m & ~ant
head |= m & (yy >= SEAM - 8) & (yy < SEAM) & (xx > 200) & (xx < 550)  # 8px overlap under the seam hides it when antennae rotate

def to_path(mask):
    small = np.array(
        Image.fromarray(mask.astype(np.uint8) * 255).resize((W // K, H // K), Image.BOX), dtype=float
    ) / 255
    bm = potrace.Bitmap(~(small > 0.5))  # potracer traces False as ink
    plist = bm.trace(turdsize=2, alphamax=ALPHA, opticurve=True, opttolerance=0.2 if K <= 2 else 0.5)
    f = lambda p: f"{p.x * K:.1f} {p.y * K:.1f}"
    d = []
    for c in plist:
        d.append(f"M{f(c.start_point)}")
        for s in c.segments:
            d.append(f"L{f(s.c)}L{f(s.end_point)}" if s.is_corner else f"C{f(s.c1)} {f(s.c2)} {f(s.end_point)}")
        d.append("Z")
    return "".join(d)

# --- pixel grid for the "compile" effect ----------------------------------------
G = 15
cells = [[gx, gy] for gy in range(0, H, G) for gx in range(0, W, G) if m[gy:gy + G, gx:gx + G].mean() >= 0.5]

ys, xs = np.where(m)
holes = ndimage.binary_fill_holes(m) & ~m
hl, hn = ndimage.label(holes)
eyes = []
for i in range(1, hn + 1):
    ey, ex = np.where(hl == i)
    eyes.append([int(ex.min()), int(ey.min()), int(ex.max() - ex.min() + 1), int(ey.max() - ey.min() + 1)])

json.dump(
    {
        "size": [W, H],
        "bbox": [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
        "head": to_path(head),
        "antennaL": to_path(antL),
        "antennaR": to_path(antR),
        "pivotL": [283, SEAM],
        "pivotR": [467, SEAM],
        "eyes": sorted(eyes),
        "grid": G,
        "cells": cells,
    },
    open(OUT, "w"),
)
print("K", K, "cells", len(cells), "eyes", sorted(eyes))
