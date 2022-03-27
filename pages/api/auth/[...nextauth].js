import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi from "../../../lib/spotify"
import {LOGIN_URL} from "../../../lib/spotify"


async function refreshAccessToken(token){
  try{

    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN IS",refreshedToken);
    return{
      ...token,
      accessToken:refreshedToken.access_token,
      accessTokenExpires:Date.now + refreshedToken.expires_at * 1000,

      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      //zamjeni ako je dosao novi ili se vrati na stari token
    }

  }
  catch(err){
    console.error(err)
    return{
      ...token,
      error:"RefreshAccesTokenError"
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages:{
    signIn:"/login"
  },
  callbacks:{
    async jwt({token,account,user}){
      //Ako se prvi put logiramo
      if(account && user){
        return{
          ...token,
          accessToken:account.access_token,
          refreshToken:account.refresh_token,
          username:account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000 //miliseconds
        };
      }
      //vrati nam prijasnji token ako jos nije istekao
      if(Date.now() < token.accessTokenExpires){
        console.log("token je ispravan")
        return token;
      }
      //ako je token istekao, moramo ga resetirat

        console.log("token je istekao")
        return await refreshAccessToken(token)
    

    },
    async session({session,token}){
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    }
  }

})