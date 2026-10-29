#!/usr/bin/env python3
"""
Venezzia Detalles - Optimizador y Recortador Oficial de Imagenes de Catalogo
Dimensiones objetivo: 600 px (ancho) x 750 px (alto) [Proporción 4:5 - Ramo 2 La Ovejita]
"""

import sys
import os
import argparse
from PIL import Image

TARGET_WIDTH = 600
TARGET_HEIGHT = 750
TARGET_ASPECT = TARGET_WIDTH / TARGET_HEIGHT # 0.8 (4:5)
DEFAULT_BG = (250, 246, 245) # #faf6f5 (Tono boutique suave Venezzia)

def process_image(input_path, output_path=None, mode='smart', bg_color=DEFAULT_BG, quality=95):
    if not os.path.exists(input_path):
        print(f"Error: El archivo '{input_path}' no existe.")
        return False

    try:
        img = Image.open(input_path)
    except Exception as e:
        print(f"Error al abrir '{input_path}': {e}")
        return False

    orig_w, orig_h = img.size
    orig_aspect = orig_w / orig_h

    # Modo 1: 'smart' (Ideal para fondos transparentes o fotos de productos con fondo blanco)
    # Ajusta el producto centrado dentro del lienzo 600x750 respetando margenes boutique
    if mode == 'smart' or (img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)):
        img_rgba = img.convert('RGBA')
        
        # Margenes de respiracion iguales a Ramo 2 La Ovejita (ancho max ~520, alto max ~710)
        max_w = TARGET_WIDTH - 60
        max_h = TARGET_HEIGHT - 40
        
        scale = min(max_w / orig_w, max_h / orig_h)
        new_w = max(1, int(orig_w * scale))
        new_h = max(1, int(orig_h * scale))
        
        resized = img_rgba.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Crear lienzo 600x750 con fondo boutique
        canvas = Image.new('RGB', (TARGET_WIDTH, TARGET_HEIGHT), bg_color)
        offset_x = (TARGET_WIDTH - new_w) // 2
        offset_y = (TARGET_HEIGHT - new_h) // 2
        
        # Pegar usando canal alfa como mascara
        canvas.paste(resized, (offset_x, offset_y), mask=resized)
        final_img = canvas

    # Modo 2: 'crop' (Recorte centrado 4:5 - Para fotos completas de camara / celular)
    else:
        img_rgb = img.convert('RGB')
        
        if orig_aspect > TARGET_ASPECT:
            # La imagen es mas ancha: recortar lados centrados
            crop_w = int(orig_h * TARGET_ASPECT)
            offset_x = (orig_w - crop_w) // 2
            cropped = img_rgb.crop((offset_x, 0, offset_x + crop_w, orig_h))
        else:
            # La imagen es mas alta: recortar arriba/abajo centrados
            crop_h = int(orig_w / TARGET_ASPECT)
            offset_y = (orig_h - crop_h) // 2
            cropped = img_rgb.crop((0, offset_y, orig_w, offset_y + crop_h))
            
        final_img = cropped.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)

    if not output_path:
        base, ext = os.path.splitext(input_path)
        output_path = f"{base}_centered.jpg"

    final_img.save(output_path, "JPEG", quality=quality, optimize=True)
    print(f"[OK] Guardado: '{output_path}' -> {final_img.size[0]}x{final_img.size[1]} px (Ratio 4:5)")
    return True

def main():
    parser = argparse.ArgumentParser(
        description="Redimensiona y centra imagenes para el catalogo de Venezzia Detalles (600x750 px)"
    )
    parser.add_argument("path", help="Ruta de la imagen o carpeta a procesar")
    parser.add_argument("-o", "--out", help="Ruta de salida (archivo o carpeta)", default=None)
    parser.add_argument(
        "-m", "--mode",
        choices=['smart', 'crop'],
        default='smart',
        help="Modo: 'smart' (ajuste centrado con fondo suave estilo Ramo Ovejita) o 'crop' (recorte centrado 4:5)"
    )

    args = parser.parse_args()

    if os.path.isfile(args.path):
        process_image(args.path, args.out, mode=args.mode)
    elif os.path.isdir(args.path):
        out_dir = args.out or args.path
        os.makedirs(out_dir, exist_ok=True)
        valid_exts = ('.jpg', '.jpeg', '.png', '.webp')
        count = 0
        for f in os.listdir(args.path):
            if f.lower().endswith(valid_exts) and not f.endswith('_centered.jpg'):
                in_file = os.path.join(args.path, f)
                out_file = os.path.join(out_dir, f"{os.path.splitext(f)[0]}_centered.jpg")
                if process_image(in_file, out_file, mode=args.mode):
                    count += 1
        print(f"\nSe procesaron exitosamente {count} imagen(es).")
    else:
        print(f"Ruta no valida: '{args.path}'")

if __name__ == "__main__":
    main()
