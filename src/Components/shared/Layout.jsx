import React from 'react'
import {  Outlet } from 'react-router-dom'
import Header from './Header.jsx'


export default function Layout(){
    return(   
  

            <div    
            
            className='bg-neutral-800 w-full flex-1 flex flex-col min-h-screen' >
                <div ><Header/></div>
                <div className='p-4 overflow-y-auto flex-grow'>{          <Outlet/>}</div>
                    

           
            </div>

    
        )
}
