import React from 'react'
import {  Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout(){
    return(   
  

            <div className='flex-1 flex flex-col ' >
                <div ><Header/></div>
                <div className='p-4 overflow-y-auto'>{          <Outlet/>}</div>
                    

           
            </div>

    
        )
}
