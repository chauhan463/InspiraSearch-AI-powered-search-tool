import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './shared/LoadingSpinner.jsx';


export default function Image() {
    const [file, setFile] = useState('');
    const [folderPath, setFolderPath] = useState(()=>localStorage.getItem('folder_path') || ''); // State for folder path
    const [results, setResults] = useState(()=>{ return localStorage.getItem('results_image') ? JSON.parse(localStorage.getItem('results_image')) :[] });
    const [isLoading, setIsLoading] = useState(false);
    const [top_n, setTop_n] = useState(()=>localStorage.getItem('top') || 1);
    const [err,setErr]=useState('')

    useEffect(()=>{
        localStorage.setItem('top',top_n)
    },[top_n])

    useEffect(()=>{
        localStorage.setItem('folder_path',folderPath)
    },[folderPath])

    useEffect(() => {
        localStorage.setItem('results_image', JSON.stringify(results));
    }, [results]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFolderChange = (e) => {
        setFolderPath(e.target.value); // Update folder path state
    };

    const handleReset = ()=>{
        setFile('')
        setFolderPath('')
        setResults([])
        setTop_n('1')
        localStorage.removeItem('top')
        localStorage.removeItem('folder_path')
        localStorage.removeItem('results_image')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { 

            if (!file){
                alert("Please select image")
                return;
            }
            else if(!folderPath){
                alert("Please select folder path")
                return;
            }
            setIsLoading(true);
            setResults([]);
            
            const formData = new FormData();
            formData.append('file_image', file);
            formData.append('folder_image', folderPath); // Send folder path
            formData.append('top_image', top_n);
            
            const response = await axios.post('http://localhost:5000/api/image-search', formData, {
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

    return (
        <div className="min-h-full bg-neutral-800 flex flex-col items-center justify-center p-6">
            <div className="bg-neutral-700 p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="file" className="text-white">Select Input Image:</label>
                        <input
                            type="file"
                            id="file"
                            accept=".jpg, .jpeg, .png, .bmp"
                            onChange={handleFileChange}
                            className="border rounded py-2 px-4 text-neutral-700"
                        />
                              {file && 
                              
                              (
                            <p className="text-sm text-green-500 mt-2">
                                Selected file: {file.name}
                            </p>
                        )
                        
                        }
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
                            className="bg-blue-500 text-white py-2 px-4  rounded"
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
              
            </div>
        </div>
    );
}
