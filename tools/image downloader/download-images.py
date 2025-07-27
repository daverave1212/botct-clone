import os
import json
import requests
from urllib.parse import urlparse
from io import BytesIO
from PIL import Image


def extract_between(text, start_string, end_string):
    start_index = text.find(start_string)
    if start_index == -1:
        return None

    start_index += len(start_string)
    end_index = text.find(end_string, start_index)
    if end_index == -1:
        return None

    return text[start_index:end_index]

def get_filename_from_url(url):
    """Extract and clean the filename from the URL path, then force .png extension."""
    path = urlparse(url).path
    filename = os.path.basename(path)
    return clean_filename(filename or "image.webp")

def clean_filename(filename):
    """Remove '_icon' and change extension to .png."""
    name, _ = os.path.splitext(filename)
    cleaned_name = name.replace('_icon', '')
    return f"{cleaned_name}.png"

# Create 'images' directory if it doesn't exist
output_dir = 'images'
os.makedirs(output_dir, exist_ok=True)

# Read URLs from the file
with open('images.txt', 'r') as file:
    urls = [line.strip() for line in file if line.strip()]

# Dictionary to store names for roles.json
saved_files = []

# Download each image and convert to PNG
for url in urls:
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        # Open image from bytes
        image = Image.open(BytesIO(response.content)).convert("RGBA")

        # Get cleaned filename
        filename = get_filename_from_url(url)
        filepath = os.path.join(output_dir, filename)

        # Save as .png
        # image.save(filepath, format='PNG')
        print(f"Downloaded and converted: {url} -> {filename}")

        # Add to JSON data (base name without extension as key)
        base_name = os.path.splitext(filename)[0]
        difficulty = extract_between(url, ' - ', '/')
        saved_files.append({
            "name": base_name,
            "difficulty": difficulty
        })

    except Exception as e:
        print(f"Failed to process {url}: {e}")

# Write roles.json
with open('roles.json', 'w', encoding='utf-8') as json_file:
    json.dump(saved_files, json_file, indent=2, ensure_ascii=False)



print("Saved roles.json.")