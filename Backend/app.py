from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import comp

app = Flask(__name__)
CORS(app)



@app.route('/api/image-search', methods=['POST'])
def post_data():
    try:
        loc = request.form['location']  # Access location from form datap
        file = request.files['file']    # Access file from form data
        folder = "./Images"
        device = "cuda" if torch.cuda.is_available() else "cpu"

        # Load the model
        model, preprocess = clip.load("ViT-B/32", device=device)
        # Construct full path using os.path.join
        query_image_path = os.path.join("./Images", loc)
        database_folder = './Images'
        top_k = 5
        results = comp.search_by_image(query_image_path, database_folder, top_k)
        response = [{'filename': filename, 'similarity': similarity} for filename, similarity in results]

        print('Received location:', loc)
        print('Received file:', file.filename)
        # Process the location and file here
        return jsonify({'success': True, 'message': 'Image search successful', 'results': response})
    except Exception as e:
        print('Error processing location:', e)
        return jsonify({"success": False, "message": "Error processing location"})

@app.route('/api/text-search', methods=['POST'])
def post_textdata():
    try:
        loc = request.form['file']  # Access filename directly
        
        # Construct full path using os.path.join
        query_image_path = os.path.join("./Images", loc)
        database_folder = './Images'
        top_k = 5
        results = comp.image_search(query_image_path, database_folder, top_k)
        response = [{'filename': filename, 'similarity': similarity, 'image_path': image_path} for filename, similarity, image_path in results]

        print('Received filename:', loc)
  
        # Process the location and file here
        return jsonify({'success': True, 'message': 'Image search successful', 'results': response})
    except Exception as e:
        print('Error processing filename:', e)
        return jsonify({"success": False, "message": "Error processing filename"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
