import { ClockIcon } from '@heroicons/react/outline';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song';


function Songs() {

    const playlist = useRecoilValue(playlistState);

  return (
    <div className='px-4 flex flex-col space-y-1 pb-20 text-white'>
      <div className='grid grid-cols-2 mx-6 pb-2 border-b-[0.2px] border-[#a0a0a0] text-[#a0a0a0] border-opacity-30'>
        <div className='flex items-center space-x-4 '>
        <p>#</p>
        <p>TITLE</p>
        </div>
        <div className='flex items-center justify-between space-x-4'>
          <p className=' hidden md:inline'>ALBUM</p>
          <p className=' hidden md:inline'>DATE ADDED</p>
          <ClockIcon className='w-5 h-5'/>
        </div>
      </div>
        {playlist?.tracks.items.map((track,i)=>(
            <Song key={track.track.id} track={track} order={i}/>

            
        ))}
    </div>
  )
}

export default Songs