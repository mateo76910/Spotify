import React from 'react'
import { useEffect } from 'react';
import {signIn, useSession} from "next-auth/react"
import spotifyApi from '../lib/spotify';

function useSpotify() {

    const {data:session,status} = useSession();

    useEffect(()=>{
        if (session){
            // ako refresh tokena ne uspije, vrati ga na login
            if (session.error === "RefreshAccesTokenError"){
                signIn();
            }

            spotifyApi.setAccessToken(session.user.accessToken);

        }

    },[session])


  return spotifyApi;
}

export default useSpotify