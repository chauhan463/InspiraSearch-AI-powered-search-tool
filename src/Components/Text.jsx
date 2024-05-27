import React, { useState} from 'react';
import axios from 'axios';
import LoadingSpinner  from './shared/LoadingSpinner.jsx';



export default function Image() {

    const [file, setFile] = useState("Forest_2.jpg");
    const [results, setResults] = useState([]);
    const [isloading,setIsloading]=useState(false)

  

    const handleLoc = async (e) => {
        e.preventDefault();
        try {
            setIsloading(true);
            setResults([]);
            
            const formData = new FormData();
            formData.append('file', file);
            // Sending the file name as the location
            const response = await axios.post('http://localhost:5000/api/text-search', formData);
            console.log('Image search results:', response.data);
            setIsloading(false)
            setResults(response.data.results);

        } catch (error) {
            console.error('Error performing image search:', error);
        }
    };



    return (
        <div className='w-full items-center justify-center bg-cover p-3 flex flex-col text-white'>

            <div className='bg-cover  p-3 flex flex-col text-neutral-700'>
                <div className='flex flex-col gap-2 px-1 py-3'>
                    <div className='text-xl'>
                
                  
                        <form action="" className='flex flex-col justify-center items-center ' onSubmit={handleLoc}>
              <label htmlFor="file">Select Input Text: </label>
              <div>
              <select
                          value={file}
                          onChange={(e)=>setFile(e.target.value)}
                       
                          className="border rounded py-2 px-4 mr-2" >
                              <option value="Forest_2.jpg">Forest</option>
                              <option value="Cloudy_12.jpg">Cloudy</option>
                              <option value="SeaLake_46.jpg">Sea</option>
                           <option value="desert(2).jpg">Desert</option>
                      </select>
                      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Send 
                </button>
                </div>
                     
  
              </form>

                    </div>

                </div>
                {
                    isloading &&(
                        <div className='flex justify-center my-4 text-xl'>

<LoadingSpinner/>
                            </div>
                    )
                }
                {results && results.length > 0   &&(
                        <div className='mx-auto my-4 w-96 flex justify-center'>
    {/* Display image search results */}
    <table className="table-auto border-collapse border border-gray-500">
        <thead>
            <tr>
                <th className="border px-4 py-2">Rank</th>
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Image Path</th>
                <th className="border px-4 py-2">Similarity(%)</th>
            </tr>
        </thead>
        <tbody>
        {results.map((result, index) => (
    <tr key={index}>
        <td className="border px-4 py-2">{index + 1}</td>
        <td className="border px-4 py-2">
            <img src={"./MIXED2/" + result.filename} alt={result.filename} className="max-w-full h-auto" />
        </td>
        <td className="border px-4 py-2">{result.image_path}</td>
        <td className="border px-4 py-2">{(result.similarity * 100).toFixed(2)}%</td>
    </tr>
))}

        </tbody>
    </table>
</div>

)}
            </div>
        </div>
    );
}

