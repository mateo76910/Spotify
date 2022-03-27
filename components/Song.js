import { PlayIcon } from '@heroicons/react/outline';
import React from 'react'
import useSpotify from '../hooks/useSpotify'
import { convertmills } from '../lib/time';
import { useState } from 'react/cjs/react.development';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';

function Song({order,track}) {
    const spotifyApi = useSpotify();
    const[playButton,setPlayButton] = useState(false);

    const [currentTrackId,setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const songInfo = useSongInfo();

    const playSong = () => {
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris:[track.track.uri],
        })
    }


  return (
    <div className='grid  grid-cols-2 text-gray-500 py-1 px-5 hover:bg-[rgb(255,255,255,.1)] rounded-lg cursor-pointer'
    onClick={playSong}
    onMouseEnter={()=>{setPlayButton(true)}}
    onMouseLeave={()=>{setPlayButton(false)}} >
        
        <div className='flex items-center space-x-4'>
            <p className='text-white fill-white'>{playButton ? <PlayIcon className='h-5 w-5'/> : order + 1}</p>
            <img className='h-10 w-10' src={track.track.album.images[0].url}/>
            <div>
                <p className='w-36 lg:64 text-white truncate'>{track.track.name}</p> 
                {/* TAILWIND --- truncate --- overflow:hidden i doda tockice za placeholder */}
                <p className='w-40'>{track.track.artists[0].name}</p>
            </div>
        </div>
        <div className='flex items-center justify-between ml-auto md:ml-0'>
            <p className='w-40 truncate hidden md:inline'>{track.track.album.name}</p>
            <p className='truncate hidden md:inline'>{track.tracks?.release_date}</p>
            <p>{convertmills(track.track.duration_ms)}</p>
        </div>
    </div>
  )
}

export default Song