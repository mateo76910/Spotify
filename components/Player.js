import { useSession } from 'next-auth/react';
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify'
import { useState,useEffect,useCallback } from 'react';
import useSongInfo from '../hooks/useSongInfo';
import { SwitchHorizontalIcon,HearthIcon, VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon,ReplyIcon,VolumeUpIcon} from '@heroicons/react/solid'
import { debounce } from 'lodash';
import {LinearProgress, Slider} from '@mui/material'
import { playlistState } from '../atoms/playlistAtom';
import {convertmills} from '../lib/time.js'
import useInterval from 'use-interval';

function Player() {
    const spotifyApi = useSpotify();
    const {data:session, status} = useSession();
    const [currentTrackId,setCurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [isPlaying,setIsPlaying] = useRecoilState(isPlayingState);
    const [volume,setVolume] = useState(50);
    const [PlayerProgress,setPlayerProgress] = useState(0);


    const songInfo = useSongInfo();

    const fetchCurrentSong = () =>{
      if(!songInfo){
        spotifyApi.getMyCurrentPlayingTrack().then(data =>{
          setCurrentIdTrack(data.body?.item?.id);

          spotifyApi.getMyCurrentPlaybackState().then(data=>{
            setIsPlaying(data.body?.is_playing);
          });
        });
        fetchSongProgress();
      }
    }
//odlazak na tocno mjesto
    const GoToSecond = (positionMs) =>{
      spotifyApi.seek(positionMs)
      .then(function(){
        console.log("Otisao sam na" + positionMs);
      },
      function(err){
        console.log(err);
      })
    }



    const fetchSongProgress = () =>{
      spotifyApi.getMyCurrentPlayingTrack().then(
        data =>{
          setPlayerProgress(data?.body?.progress_ms);
        }
      )
    }

//
    const handlePlayPause = () =>{
      spotifyApi.getMyCurrentPlaybackState().then(data=>{
        if(data.body.is_playing){
          spotifyApi.pause();
          setIsPlaying(false);
        } else{
          spotifyApi.play();
          setIsPlaying(true);
        }
      })
      fetchSongProgress();
      console.log((PlayerProgress*100)/songInfo.duration_ms) //trenutni dio na skali od
      console.log(songInfo.duration_ms)
    }
    

//Dohvaćanje pjesme i početak intervala za SongBar + default volume
    useEffect(()=>{
      if(spotifyApi.getAccessToken && !currentTrackId){
        fetchCurrentSong();
        fetchSongProgress();
        setVolume(50);
      }
    },[currentTrackId,spotifyApi,session])

      useInterval(()=>{
        setPlayerProgress( PlayerProgress + 1000);
      },isPlaying ? 1000 : null)

    


//Naštimavanje debounca za volume
    const debouncedAdjustVolume = useCallback(
      debounce((volume)=>{
        spotifyApi.setVolume(volume).catch(err =>{})
      },100,[])
    )

    useEffect(()=>{
      if(volume > 0 && volume <100){
        debouncedAdjustVolume(volume);
      }
    },[volume])



  return (
      
    <div className='h-[90px] bg-[#181818] text-white border-t-[1px] border-[#282828]
    grid grid-cols-3 
    md:text-base px-[16px]'>
        {/* lijevo dio */}
        <div className='flex items-center space-x-4'>
            <img className="hidden md:inline h-[56px] w-[56px]"
             src={songInfo?.album.images?.[0].url}></img>
           <div>
             <h3>
               {songInfo?.name}
                <p className="text-sm color">{songInfo?.artists?.[0]?.name}</p>
              </h3>
           </div>
         </div>


         <div className='flex flex-col items-center  justify-center'>
           <div className='flex items-center space-x-3'>
           <SwitchHorizontalIcon className='button'/>
           <RewindIcon className='button'/>
           {isPlaying ? (
             <PauseIcon onClick={handlePlayPause} className='button w-10 h-10'/>
             
           ): (
             <PlayIcon  onClick={handlePlayPause} className='button w-10 h-10'/>

           )}
           <FastForwardIcon className='button'/>
           <ReplyIcon className='button' onClick={() => GoToSecond(1500)}/>
           </div>


            <div className='w-full flex items-center justify-evenly space-x-[8px]'>
            <p className='text-xs text-[#69757d]'>{convertmills(PlayerProgress)}</p>
           <Slider value={(PlayerProgress*100)/songInfo?.duration_ms}
              sx={{
                height:"4px",
                color:"#b3b3b3",
                padding:"0",
                '& .MuiSlider-thumb':{
                  color:"transparent",
                  width: 12,
                  height: 12,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0px 0px 0px 0px',
                  }
                },
                '& .MuiSlider':{
                  color:"#b3b3b3"
                },
                '& .MuiSlider-rail': {
                  color:"#535353",
                },
                '&:hover, &.Mui-focusVisible':{
                  color:"#1db954",
                  '& .MuiSlider-thumb':{
                    color:"white"
                  },
                }
              }}/>
              <p className='text-xs text-[#69757d]'>{convertmills(songInfo?.duration_ms)}</p>
              
            </div>


         </div>

         <div className='flex items-center md:space-x-3 space-x-4 justify-end'>
           <VolumeDownIcon 
           onClick={()=>volume > 0 && setVolume(volume-10)} 
           className='button'/>
           <input className='w-14 md:w-28' value={volume} onChange={(e)=> setVolume(Number(e.target.value))} min={0} max={100} type="range"/>
           <VolumeUpIcon 
           onClick={()=> volume < 100 && setVolume(volume+10)}
           className='button'/>

         </div>
    </div>
  )
}

export default Player