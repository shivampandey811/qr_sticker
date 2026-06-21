import shutil
import os

source_dest_pairs = [
    ("/Users/shivampandey/.gemini/antigravity/brain/fdc5a188-9682-42b9-9ac8-f415b5d2bb98/sticker_holographic_1781984105505.png", "/Users/shivampandey/Desktop/projects/personal/qr_sticker/frontend/public/sticker_holographic.png"),
    ("/Users/shivampandey/.gemini/antigravity/brain/fdc5a188-9682-42b9-9ac8-f415b5d2bb98/sticker_cyberpunk_1781984123461.png", "/Users/shivampandey/Desktop/projects/personal/qr_sticker/frontend/public/sticker_cyberpunk.png"),
    ("/Users/shivampandey/.gemini/antigravity/brain/fdc5a188-9682-42b9-9ac8-f415b5d2bb98/sticker_amber_glow_1781984140271.png", "/Users/shivampandey/Desktop/projects/personal/qr_sticker/frontend/public/sticker_amber_glow.png"),
    ("/Users/shivampandey/.gemini/antigravity/brain/fdc5a188-9682-42b9-9ac8-f415b5d2bb98/apply_windscreen_1781984551521.png", "/Users/shivampandey/Desktop/projects/personal/qr_sticker/frontend/public/usecase_windscreen.png"),
    ("/Users/shivampandey/.gemini/antigravity/brain/fdc5a188-9682-42b9-9ac8-f415b5d2bb98/rain_proof_1781984564391.png", "/Users/shivampandey/Desktop/projects/personal/qr_sticker/frontend/public/usecase_raining.png"),
    ("/Users/shivampandey/.gemini/antigravity/brain/fdc5a188-9682-42b9-9ac8-f415b5d2bb98/traffic_ping_1781984582203.png", "/Users/shivampandey/Desktop/projects/personal/qr_sticker/frontend/public/usecase_traffic.png"),
    ("/Users/shivampandey/.gemini/antigravity/brain/fdc5a188-9682-42b9-9ac8-f415b5d2bb98/no_parking_ping_1781984595964.png", "/Users/shivampandey/Desktop/projects/personal/qr_sticker/frontend/public/usecase_noparking.png")
]

for src, dst in source_dest_pairs:
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"Copied {src} to {dst}")
    else:
        print(f"Source not found: {src}")
