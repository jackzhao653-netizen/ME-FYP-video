import cv2
import numpy as np
import svgwrite
import os

def vectorize_image(img_path, out_path, color_mapping):
    print(f"Vectorizing {img_path}...")
    img = cv2.imread(img_path)
    if img is None:
        print(f"Could not read {img_path}")
        return
        
    H, W = img.shape[:2]
    # Resize to have max dimension 500 for smooth vectorization
    scale = 500.0 / max(H, W)
    if scale < 1.0:
        img = cv2.resize(img, (int(W * scale), int(H * scale)), interpolation=cv2.INTER_AREA)
        H, W = img.shape[:2]

    # Convert to RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # K-means color quantization to simplify colors
    pixels = img_rgb.reshape((-1, 3)).astype(np.float32)
    K = len(color_mapping)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.1)
    
    # Initialize centers based on provided colors
    centers_init = np.array([c['rgb'] for c in color_mapping], dtype=np.float32)
    
    # We will just assign pixels to the nearest initialized center
    def get_closest(p, centers):
        dists = np.sum((centers - p)**2, axis=1)
        return np.argmin(dists)

    labels = np.zeros(pixels.shape[0], dtype=np.int32)
    for i in range(pixels.shape[0]):
        labels[i] = get_closest(pixels[i], centers_init)
        
    quantized = centers_init[labels].reshape(img_rgb.shape).astype(np.uint8)
    label_img = labels.reshape((H, W))

    # Create SVG
    dwg = svgwrite.Drawing(out_path, viewBox=f"0 0 {W} {H}")
    
    # Basic smoothing
    for idx, cinfo in enumerate(color_mapping):
        if cinfo.get('ignore', False):
            continue
            
        color_hex = cinfo['hex']
        mask = (label_img == idx).astype(np.uint8) * 255
        
        # Morphological opening/closing to clean up noise
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
        
        path_data = ""
        for i, cnt in enumerate(contours):
            # approximate contour
            epsilon = 0.002 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)
            
            if len(approx) < 3:
                continue
                
            pts = approx.reshape(-1, 2)
            path_data += f"M {pts[0][0]} {pts[0][1]} "
            for p in pts[1:]:
                path_data += f"L {p[0]} {p[1]} "
            path_data += "Z "
            
        if path_data:
            dwg.add(dwg.path(d=path_data, fill=color_hex, fill_rule="evenodd"))
            
    dwg.save()
    print(f"Saved {out_path}")

# Run for all 4 images
try:
    # 1. STOP sign
    vectorize_image("photo_2026-03-19_01-21-29.jpg", "stop_sign.svg", [
        {'rgb': [255, 255, 255], 'hex': '#FFFFFF', 'ignore': False},
        {'rgb': [200, 20, 30], 'hex': '#D42027', 'ignore': False},
        {'rgb': [0, 0, 0], 'hex': '#000000', 'ignore': False} # for any dark edges
    ])

    # 2. Turn Right
    vectorize_image("photo_2026-03-19_01-21-39.jpg", "turn_right.svg", [
        {'rgb': [255, 255, 255], 'hex': '#FFFFFF', 'ignore': False},
        {'rgb': [0, 70, 150], 'hex': '#005A9C', 'ignore': False},
        {'rgb': [0, 0, 0], 'hex': '#000000', 'ignore': False}
    ])

    # 3. Children Crossing
    vectorize_image("photo_2026-03-19_01-21-04.jpg", "children_crossing.svg", [
        {'rgb': [255, 255, 255], 'hex': '#FFFFFF', 'ignore': False},
        {'rgb': [200, 20, 30], 'hex': '#D42027', 'ignore': False},
        {'rgb': [20, 20, 20], 'hex': '#111111', 'ignore': False}
    ])

    # 4. Pedestrian Crossing
    vectorize_image("photo_2026-03-19_01-21-22.jpg", "pedestrian_crossing.svg", [
        {'rgb': [255, 255, 255], 'hex': '#FFFFFF', 'ignore': False},
        {'rgb': [0, 70, 150], 'hex': '#005A9C', 'ignore': False},
        {'rgb': [20, 20, 20], 'hex': '#111111', 'ignore': False}
    ])
except Exception as e:
    print("Error:", e)
