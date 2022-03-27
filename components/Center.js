import React from 'react'
import {useSession} from "next-auth/react"
import { ChevronDownIcon} from '@heroicons/react/outline';
import {PauseIcon } from '@heroicons/react/solid';
import { useEffect } from 'react';
import { shuffle}from "lodash"
import { useState } from 'react/cjs/react.development';
import { useRecoilState, useRecoilValue } from 'recoil';
import {  playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';


const colors =[
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500"
]

function Center() {
    const spotifyApi = useSpotify();
    const {data:session} = useSession();
    const [color,setColor] = useState(null);
    const playlistId =useRecoilValue(playlistIdState);
    const [playlist,setPlaylist] = useRecoilState(playlistState);
    

    useEffect(() =>{
        setColor(shuffle(colors).pop());
        console.log(playlist)
    },[playlistId])

    useEffect(() =>{
        if(spotifyApi.getAccessToken()){
        spotifyApi.getPlaylist(playlistId)
        .then((data) =>{
            setPlaylist(data.body);
        })
        .catch(error => console.log("Ne mogu dohvatiti plejliste",error))
    }
    },[spotifyApi,playlistId]);
  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
    
    <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-[#121212] space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full text-white p-1 pr-2'>
            <img className="rounded-full w-10 h-10"src={session?.user.image}></img>
            <h2>{session?.user.name}</h2>
            <ChevronDownIcon className='h-5 w-5'/>
        </div>
    </header>
    <section className={`flex items-end space-x-7 bg-gradient-to-b  ${color} to-black  h-[360px] text-white p-8` }>
    <img className='h-[232px] w-[232px] shadow-2xl' src={playlist?.images[0]?.url}></img>
    <div>
        <p className='text-sm font-semibold'>PLAYLIST</p>
        <h1 className='text-[111px] font-bold tracking-tighter overflow-hidden'>{playlist?.name}</h1>
        <a href={playlist?.owner?.external_urls.spotify} className='font-bold'>{playlist?.owner?.display_name}</a>
    </div>
    </section>
    <div className="gradijent pt-[1px] pb-2">
        <PauseIcon className='button w-[72px] h-[72px] fill-[#1ed760] mx-[16px] my-[16px] ' />
        <Songs/>
    </div>
    
    </div>
  )
}

export default Center