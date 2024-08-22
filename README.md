# InspiraSearch: AI-Powered Search Tool

InspiraSearch is a powerful AI-driven search tool leveraging CLIP (Contrastive Language-Image Pretraining) to allow users to search for images based on text or other images. Whether you're looking to find similar images or search through a directory using descriptive text, InspiraSearch makes it easy and efficient.

## Features

- **Text-Based Image Search**: Enter a descriptive text to find images that match your query.
- **Image-Based Search**: Upload an image to find similar images in the directory.
- **Local Storage Integration**: User preferences and recent search results are stored locally to ensure a smooth experience across sessions.
- **Responsive UI**: The tool is designed to work seamlessly on various screen sizes.
- **CLIP Model**: Powered by OpenAI's CLIP model, which efficiently processes both text and images for powerful search capabilities.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Python 3.x** installed on your local machine.
- **Node.js and npm** installed to run the React frontend.
- **Pip** for managing Python packages.

## Installation

### Backend

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/inspiraSearch.git
    cd inspiraSearch/backend
    ```

2. **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. **Install required packages**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Run the backend server**:
    ```bash
    flask run
    ```

### Frontend

1. **Navigate to the frontend directory**:
    ```bash
    cd ../frontend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the React development server**:
    ```bash
    npm start
    ```

## Usage

### Image Search

- **Select Input Image**: Choose an image from your local device to search for similar images.
- **Select Base Directory**: Provide the path to the directory where images are stored.
- **Select Top Images**: Define the number of top results to display.

### Text Search

- **Enter Description**: Input text to search for images that match the description.
- **Select Base Directory**: Provide the path to the directory where images are stored.
- **Select Top Images**: Define the number of top results to display.

### Error Handling

- The tool will alert you if the directory is invalid or if no image is selected.

## Contributing

To contribute to InspiraSearch:

1. **Fork the repository**.
2. **Create a new branch** (`git checkout -b feature-branch`).
3. **Commit your changes** (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature-branch`).
5. **Open a Pull Request**.

## License

This project is open source and available under the [MIT License](LICENSE).
