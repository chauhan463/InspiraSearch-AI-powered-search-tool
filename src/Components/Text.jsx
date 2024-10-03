import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './shared/LoadingSpinner.jsx';

export default function Image() {
    // Initialize states from localStorage or default values
    const [file, setFile] = useState(() => localStorage.getItem('file') || "");
    const [folderPath, setFolderPath] = useState(() => localStorage.getItem('folderPath') || ''); 
    const [results, setResults] = useState(
        () => {
        return localStorage.getItem('results_text') ? JSON.parse(localStorage.getItem('results_text')) : [];
    }

);
    const [isLoading, setIsLoading] = useState(false);
    const [top_n, setTop_n] = useState(() => localStorage.getItem('top_n') || 1);
    const [err,setErr]=useState('')
    

    // Save states to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('file', file);
  
    }, [file]);

    useEffect(() => {
        localStorage.setItem('folderPath', folderPath);
    }, [folderPath]);

    useEffect(() => {
        localStorage.setItem('top_n', top_n);
    }, [top_n]);

    useEffect(() => {
        localStorage.setItem('results_text', JSON.stringify(results));
    }, [results]);

    const handleFolderChange = (e) => setFolderPath(e.target.value);

    const handleLoc = async (e) => {
        e.preventDefault();
        try {
            if (!file){
                alert("No prompt given")
                return;
            }
            else if(!folderPath){
                alert("Please select folder path")
                return;
            }
            setErr("")
            setIsLoading(true);
            setResults([]);
            const formData = new FormData();
            formData.append('file_text', file);
            formData.append('folder_text', folderPath);
            formData.append('top_text', top_n);

            const response = await axios.post('http://localhost:5000/api/text-search', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Image search results:', response.data);
            setResults(response.data.results);
        } catch (error) {
            console.error('Error performing image search:', error);
            setErr("PROBLEM")
            console.log("SERVER NOT GOOD");
            

        } finally {
            setIsLoading(false);
            
        }
    };

    const handleReset = () => {
        // Clear all states and localStorage
        setFile("");
        setFolderPath("");
        setTop_n(1);
        setResults([]);
        localStorage.removeItem('file');
        localStorage.removeItem('folderPath');
        localStorage.removeItem('top_n');
        localStorage.removeItem('results');
    };

    return (
        <div className="min-h-full bg-neutral-800 flex flex-col items-center justify-center p-6">
            <div className="bg-neutral-700 p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <form className="flex flex-col gap-4" onSubmit={handleLoc}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="file" className="text-white">Enter text prompt:</label>
                        <input 
                            type="text"
                            value={file}
                            placeholder="eg: a photo of dog"
                            onChange={(e) => setFile(e.target.value)}
                            className="border rounded py-2 px-4 text-neutral-700"
                        />
                    </div>
                    <div className="flex flex-col gap-2 pb-5">
                        <label htmlFor="folderPath" className="text-white">Select Base Directory:</label>
                        <input
                            type="text"
                            id="folderPath"
                            value={folderPath}
                            onChange={handleFolderChange}
                            placeholder="Enter folder path"
                            className="border rounded py-2 px-4 text-neutral-700"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="top" className="text-white">Select Top Images:</label>
                        <input
                            type="number"
                            id="top"
                            value={top_n}
                            min='1'
                            onChange={(e) => setTop_n(e.target.value)}
                            placeholder="Enter top images"
                            className="border rounded py-2 px-4 text-neutral-700"
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button 
                            type="button" 
                            className="bg-gray-500 text-white py-2 px-4 rounded" 
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Send
                        </button>
                    </div>
                </form>

                {isLoading && (
                    <div className="flex justify-center my-4 text-xl">
                        <LoadingSpinner />
                    </div>
                )}
                {err && <p className="flex justify-center my-4 text-xl font-bold text-red-600"> Please start the server.</p>}
{results[0] === "ERROR" ? (
    <p className="flex justify-center my-4 text-xl font-bold text-red-600">Invalid Directory</p>
) : results && results.length > 0 && (
    <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map((result, index) => (
            <div 
                key={index} 
                className="relative bg-neutral-800 p-4 overflow-hidden rounded-lg shadow-lg transform transition-transform hover:scale-105"
            >
                <img 
                    src={`http://localhost:5000${result.image_url}`} 
                    alt={result.filename} 
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                    <p className="text-white text-lg font-semibold">{result.filename}</p>
                    <p className="text-white text-sm">Similarity: {result.similarity}</p>
                </div>
            </div>
        ))}
    </div>
) }


                {/* {results && results.length > 0 && (
                    <div className="pt-10  grid sm:grid-cols-3 grid-cols-2 gap-2 sm:gap-4">
                        {results.map((result, index) => (
                            <div 
                                key={index} 
                                className="relative bg-neutral-800 p-4 overflow-hidden aspect-w-1 aspect-h-1"
                            >
                          
                                <img 
                                    src={`http://localhost:5000${result.image_url}`} 
                                    alt={result.filename} 
                                    className="w-full h-full object-cover transition-transform transform hover:scale-105"
                                    loading='lazy'
                                />
                            </div>
                        ))}
                    </div>
                )} */}
            </div>
        </div>
    );
}
