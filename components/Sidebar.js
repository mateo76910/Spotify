import React from 'react'
import{
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
} from "@heroicons/react/outline"
import { signOut,useSession } from 'next-auth/react'
import { useState } from 'react';
import useSpotify from '../hooks/useSpotify';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';


function Sidebar() {
    const {data:session,status} = useSession();
    const spotifyApi = useSpotify();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId,setPlaylistId] =useRecoilState(playlistIdState);

    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data)=>{
                setPlaylists(data.body.items);
            })
        }
    }, [session,spotifyApi]);


  return (
    <div className='text-gray-500 p-5 
     border-gray-900 overflow-y-scroll h-screen 
     scrollbar-hide text-[14px]  w-[264px]  pb-36'>
         <img className="w-[140px] h-[42px]" src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"></img>
        <div className='space-y-4 text-[#b3b3b3] font-bold '>
        <button className="flex items-center space-x-2 hover:text-white"
        onClick={()=>signOut()}>
                <p>Logout</p>
                </button>
            <button className="flex items-center space-x-3 hover:text-white font-bold ">
                <HomeIcon className="h-6 w-6"/>
                <p>Home</p>
            </button>
            <button className="flex items-center space-x-3 hover:text-white font-bold ">
                <SearchIcon className="h-6 w-6"/>
                <p>Search</p>
            </button>
            <button className="flex items-center space-x-3 hover:text-white font-bold pb-6 ">
                <LibraryIcon className="h-6 w-6"/>
                <p>Your Libary</p>
            </button>

            
            <button className="flex items-center space-x-2 hover:text-white font-bold ">
                <PlusCircleIcon className="h-6 w-6"/>
                <p>Create Playlist</p>
            </button>
            <button className="flex items-center space-x-2 hover:text-white font-bold ">
                <HeartIcon className="h-6 w-6"/>
                <p>Liked Songs</p>
            </button>
            <hr className='border-t-[0.1px] border-[#b3b3b3] opacity-30'/>
            {/* Playlists */}
            {playlists.map((playlist)=>{
                return (
                <p key={playlist.id}
                 onClick={()=>{setPlaylistId(playlist.id)}}
                 className="cursor-pointer hover:text-white">
                    {playlist.name}
                </p>
                )
            })}
        </div>
        
    </div>
  )
}

export default Sidebar