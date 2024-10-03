import os
import torch
import clip
from PIL import Image
from tqdm import tqdm
import numpy as np
from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS
import os
from waitress import serve


app = Flask(__name__)
CORS(app)

def load_images_from_folder(folder):
    images = []
    file_names = []
    for filename in tqdm(os.listdir(folder), desc="Loading images"):
        if filename.endswith((".jpg", ".jpeg", ".png", ".bmp")):
            img = Image.open(os.path.join(folder, filename)).convert("RGB")
            if img is not None:
                images.append(img)
                file_names.append(filename)
    return images, file_names

def preprocess_images(images, preprocess):
    return torch.stack([preprocess(img) for img in tqdm(images, desc="Preprocessing images")])

def cosine_similarity(a, b):
    a = a.flatten()
    b = b.flatten()
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def get_image_features(images, model, preprocess, device):
    with torch.no_grad():
        image_features = model.encode_image(preprocess_images(images, preprocess).to(device)).cpu().numpy()
    return image_features

def get_text_features(text, model, device):
    with torch.no_grad():
        text_features = model.encode_text(clip.tokenize([text]).to(device)).cpu().numpy()
    return text_features
def normalize_features(features):
    return features / np.linalg.norm(features, axis=1, keepdims=True)

def search_by_text(text, image_features, file_names, model, device, top_k=5):
    text_features = get_text_features(text, model, device)
    similarities = np.array([cosine_similarity(image_feature, text_features) for image_feature in image_features])
    top_indices = np.argsort(similarities)[::-1][:top_k]
    results = [(file_names[idx], similarities[idx]) for idx in top_indices]
    return results


def search_by_image(query_image, image_features, file_names, model, preprocess, top_k=5):
    query_image = preprocess(query_image).unsqueeze(0)
    with torch.no_grad():
        query_features = model.encode_image(query_image.cuda()).cpu().numpy()
    similarities = np.array([cosine_similarity(image_feature, query_features) for image_feature in image_features])
    top_indices = np.argsort(similarities)[::-1][:top_k]
    results = [(file_names[idx], similarities[idx]) for idx in top_indices]
    return results




@app.route('/serve_image/<path:filename>')
def serve_image(filename):
    # Get the folder directory from the request
    folder = request.args.get('folder')
    
    if folder and os.path.isdir(folder):
        # Construct the full path to the image file
        file_path = os.path.join(folder, filename)
        
        # Debug prints for troubleshooting
        print(f"Request for file: {filename}")
        print(f"Looking in directory: {folder}")
        print(f"Full file path: {file_path}")
        
        if os.path.exists(file_path):
            return send_from_directory(folder, filename)
        else:
            print(f"File not found: {file_path}")
            abort(404)
    else:
        print(f"Invalid folder path: {folder}")
        abort(400)  # Bad Request
        
@app.route('/api/image-search', methods=['POST'])
def post_data():
    try:
        folder = request.form['folder_image']  # Access folder path from form data
        file = request.files['file_image']    # Access file from form data
        top=request.form['top_image']
        top_k=int(top)
    
        device = "cuda" if torch.cuda.is_available() else "cpu"

        # Ensure the folder path is correctly formatted
        if not os.path.isdir(folder):
            raise ValueError("Invalid directory path")

        # Load the model
        model, preprocess = clip.load("ViT-B/32", device=device)
        
        # Load images from the specified folder
        images, file_names = load_images_from_folder(folder)
        image_features = get_image_features(images, model, preprocess, device)
        image_features = normalize_features(image_features)

        query_image = Image.open(file.stream).convert("RGB")
     
        
        image_results = search_by_image(query_image, image_features, file_names, model, preprocess, top_k)
       
        response = [
            {
                'filename': filename,
                'similarity': str(similarity),
                'image_url': f'/serve_image/{filename}?folder={folder}'  # Include folder path in URL
            } 
            for filename, similarity in image_results
        ]
 
        # Process the location and file here
        print({'success': True, 'message': 'Image search successful', 'results': response})
        return jsonify({'success': True, 'message': 'Image search successful', 'results': response})
    except Exception as e:
        response= ["ERROR"]
        print('Error processing request:', e)
        return jsonify({"success": False, "message": "Error processing request",'results': response})
    
@app.route('/api/text-search', methods=['POST'])
def post_textdata():
    try:
        text_query = request.form['file_text']  # Access filename directly
        top=request.form['top_text']
        top_k=int(top)
        print(text_query)
        folder = request.form['folder_text']
        # folder =r"D:\IITJ pics\Sexy"
        

        
        # Ensure the folder path is correctly formatted
        if not os.path.isdir(folder):
            raise ValueError("Invalid directory path")

        # Load the model
        images,file_names = load_images_from_folder(folder)
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        model, preprocess = clip.load("ViT-B/32", device=device)
        image_features = get_image_features(images, model, preprocess,device)
        image_features = normalize_features(image_features)
   
        text_results = search_by_text(text_query, image_features, file_names, model, device, top_k)
        response = [
            {
                'filename': filename,
                'similarity': str(similarity),
                'image_url': f'/serve_image/{filename}?folder={folder}'  # Include folder path in URL
            } 
            for filename, similarity in text_results
        ]

        print('Received filename:', text_query)
  
        # Process the location and file here
        return jsonify({'success': True, 'message': 'Image search successful', 'results': response})
    except Exception as e:
        response= ["ERROR"]
        print('Error processing request:', e)
        return jsonify({"success": False, "message": "Error processing request",'results': response})


if __name__ == '__main__':
    # os.environ['BASE_IMAGE_DIRECTORY'] = r"D:\Rishikesh trip\NEW"
    serve(app, host='0.0.0.0', port=5000)