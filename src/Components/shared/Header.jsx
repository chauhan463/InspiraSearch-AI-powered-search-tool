import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import backgroundImage from '../../images/BG_3.jpg';
import Logo_bel from '../../images/new.png';

const linkClass ='flex focus:outline-none focus:ring-offset-2 focus:ring-gray-800 items-center gap-2  leading-3 shadow-md rounded  px-3 py-2 my-1 mx-1 hover:no-underline active:bg-cyan-600 active:outline-cyan-600 active:text-white rounded-sm '

export default function Header(){
    return(
  
 
 <div className="flex flex-col">
             <div style={{ backgroundImage: `url(${backgroundImage})` }} className='h-20 border-b flex flex-row w-auto gap-20 shadow-2 text-white font-bold cursor-pointer h-16 p-4 flex items-center text-2xl'>
                
                <div className='ml-10 w-44 h-auto flex py-3'>
                    <img src={Logo_bel} alt="BEL logo" />
                </div>
                <div className='text-2xl flex w-3/5  justify-center'>
                    Content Based Image Retrieval (CBIR)
                </div>
            </div>

     

            <div className="m-8 flex items-center justify-center flex-auto space-x-2" >
                {HEADER_LINKS.map((item)=>(
                    <HeaderLink key={item.key} item={item}/>
                ))}
                
            </div>

  
          
        

</div> 
        
        )
        
  
    }

    const HEADER_LINKS = [
        {
            key: 'Image',
            label: 'Image',
            path: '/',

          },
          {
            key: 'text',
            label: 'Text',
            path: '/text',
          
          }
       
      ];
    

    function HeaderLink({item}){
        const { pathname } = useLocation();
        console.log(pathname);
    
        // Check if the current pathname starts with the item's path
  
        return(
            
            <Link to={item.path} className={classNames( pathname==item.path ? ' text-white bg-cyan-600 active:outline-cyan-600 ' : 'text-gray-600 border border-gray-200 bg-gray-50 cursor-pointer px-3 py-2.5  leading-3 shadow-md rounded hover:bg-gray-200',linkClass)}>
                
                {item.label}
            </Link>
        )
    }

