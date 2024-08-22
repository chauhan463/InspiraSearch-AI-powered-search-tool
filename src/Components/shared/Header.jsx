import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import Logo from '../../images/LOGO5.png';
const linkClass = 'flex items-center gap-2  px-3 py-2 my-1 mx-1  relative';
// const primary_color='#9addcc'

export default function Header(){
    return(
  
 
 <div className="flex flex-col">
             <div  className='lg:h-16  flex lg:flex-row flex-col w-auto lg:gap-20 shadow-2 text-white font-bold cursor-pointer  sm:p-4  items-center md:text-2xl'>
                
                <div className='lg:ml-10 sm:w-44 w-32 h-auto flex py-3'>
                    <img src={Logo} alt="logo" />
                </div>
                <div className='sm:text-2xl flex w-3/5  justify-center'>
                {HEADER_LINKS.map((item)=>(
                    <HeaderLink key={item.key} item={item}/>
                ))}
                    {/* Content Based Image Retrieval (CBIR) */}
                </div>
            
            </div>

     

  
          
        

</div> 
        
        )
        
  
    }

    const HEADER_LINKS = [

          {
            key: 'text',
            label: 'Text',
            path: '/',
          
          },
          {
            key: 'Image',
            label: 'Image',
            path: '/Image',

          }
       
      ];
    

    function HeaderLink({item}){
        const { pathname } = useLocation();
        
    
        // Check if the current pathname starts with the item's path
  
        return(
            
          

            <Link 
              to={item.path} 
              className={classNames(
                pathname === item.path 
                  ? 'text-[#9addcc] border-b-2 border-[#9addcc]  '
                  : 'text-gray-400 cursor-pointer px-3 py-2.5  hover:text-gray-200',
                linkClass
              )}
            >
              {item.label}
            </Link>
            
        )
    }

