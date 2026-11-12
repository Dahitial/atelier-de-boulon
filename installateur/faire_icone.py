"""Assemble des PNG (16 à 256 px) en un fichier .ico Windows (les PNG sont stockés tels quels)."""
import struct, sys

def build_ico(pngs, out):
    entries, data = [], b""
    offset = 6 + 16 * len(pngs)
    for size, path in pngs:
        blob = open(path, "rb").read()
        dim = 0 if size >= 256 else size
        entries.append(struct.pack("<BBBBHHII", dim, dim, 0, 0, 1, 32, len(blob), offset + len(data)))
        data += blob
    with open(out, "wb") as f:
        f.write(struct.pack("<HHH", 0, 1, len(pngs)) + b"".join(entries) + data)

if __name__ == "__main__":
    out, *items = sys.argv[1:]
    build_ico([(int(i.split("=")[0]), i.split("=", 1)[1]) for i in items], out)
    print("icône écrite :", out)
