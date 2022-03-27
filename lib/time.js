export function convertmills(mils){
    const min = Math.floor(mils/60000);
    const sec = ((mils % 60000)/1000).toFixed(0);
    return sec == 60 ? min + 1 + ":00" : min + ':' + (sec <10 ? "0" : "") + sec;
}