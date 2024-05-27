from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
from scipy.spatial.distance import cosine
from keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.resnet50 import preprocess_input
import tensorflow as tf


# Load pre-trained ResNet model
from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.metrics.pairwise import cosine_similarity
import os
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
from tensorflow.keras.applications import ResNet50

# Load pre-trained ResNet model
base_model = ResNet50(include_top=False, weights='imagenet', pooling='avg')
# Define function to preprocess and extract features from an image
def extract_features(image_path):
    image = load_img(image_path, target_size=(224, 224))  # Load and resize image
    image = img_to_array(image)  # Convert image to numpy array
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    image = preprocess_input(image)  # Preprocess image
    features = base_model.predict(image)  # Extract features
    features = features.flatten()  # Flatten the feature vector
    print(features)
    print(features.shape)
    return features


# Define function to perform image-based search
def image_search(query_image_path, database_folder, top_k=5):
    query_features = extract_features(query_image_path)  # Extract features of query image

    # Iterate over images in database folder
    similarity_images = []
    for filename in os.listdir(database_folder):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            image_path = os.path.join(database_folder, filename)
            database_features = extract_features(image_path)  # Extract features of database image
            similarity = compute_similarity(query_features, database_features)  # Compute similarity
            similarity_images.append((filename, similarity, image_path))

    # Sort similarity scores in descending order
    similarity_images.sort(key=lambda x: x[1], reverse=True)

    # Return top-k similar images
    return similarity_images[:top_k]

# Define function to compute cosine similarity between two feature vectors
def compute_similarity(feature1, feature2):
    return 1 - cosine(feature1, feature2)

# Define function to visualize image search results
def visualize_image_results(results):
    fig, axes = plt.subplots(1, len(results), figsize=(20, 5))
    for i, (filename, similarity, image_path) in enumerate(results):
        image = Image.open(image_path)
        axes[i].imshow(image)
        axes[i].set_title(f"Rank {i+1}, Similarity: {similarity:.2f}")
        axes[i].axis('off')
    plt.show()

# Define function to perform text-based search




