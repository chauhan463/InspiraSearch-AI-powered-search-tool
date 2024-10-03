

import { HashRouter as Router, Routes, Route} from 'react-router-dom'
// import {  } from 'react-router-dom';
import Image from "./Components/Image.jsx"
import Text from './Components/Text.jsx';
import Layout from './Components/shared/Layout.jsx';
function App() {
  return (
    <Router>
          
            <Routes>
              
            <Route path="/" element={<Layout/>}>
            <Route index element={<Text />} />
            <Route path="Image" element={<Image/>}/>

            </Route>
           
             


            </Routes>
            
        </Router>


    
  );
}

export default App;
