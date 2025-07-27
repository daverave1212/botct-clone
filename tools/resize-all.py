from PIL import Image
import os
from os import listdir
from os.path import join, isfile

input_folder = "..\\static\\images\\roles"
output_folder = "..\\static\\images\\role-thumbnails"

files = [f for f in listdir(input_folder) if isfile(join(input_folder, f)) and f.endswith('.png')]

for filename in files:
    input_path = os.path.join(input_folder, filename)
    base_name = os.path.splitext(filename)[0]
    output_path = os.path.join(output_folder, base_name + '.webp')

    # if os.path.exists(output_path):
    #     print(f"Skipping '{filename}' (already exists in output folder)")
    #     continue

    try:
        with Image.open(input_path) as img:
            resized = img.resize((346, 346), Image.LANCZOS)
            resized.save(output_path, format='WEBP')
            print(f"Saved '{output_path}'")
    except Exception as e:
        print(f"Error processing '{filename}': {e}")
