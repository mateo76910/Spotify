import {getToken} from "next-auth/jwt"
import {NextResponse} from "next/server"

export async function middleware(req){
    //token postoji ako je user ulogiran
    const token = await getToken({req,secret:process.env.JWT_SECRET});
    const {pathname} =req.nextUrl
    // dopusti req ako je sljedece istinito
    // 1) ako token postoji
    if(pathname.includes("/api/auth") || token){
        return NextResponse.next();
        
    }

    if(!token && pathname !== '/login'){
        return NextResponse.redirect('http://localhost:3000/login')
    };


 // napravit redirect ako je na loginu a vec je logiran
    

}