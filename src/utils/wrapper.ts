
const sleep = ( duration : number ) => {
    return new Promise((resolve ) => {
        setTimeout( resolve , duration); 
    })
}

/*
    Function wrapper utility 
    to retry critical functions on failure 
*/
export const functionWrapper = async<T>(
    someFunction : () => Promise<T> , 
) : Promise<T> => {
    let retryLimit = 3 ; 
    let isError : unknown ; 

    while( retryLimit > 0 ){ 
        try {
            return await someFunction(); 
        } catch (error) {
            retryLimit--; 
            isError = error ; 
            if(retryLimit > 0 ){
                await sleep(1000); 
            }
        }
    }

    if(isError instanceof Error){
        throw isError
    }

    throw new Error("Function failed after retries"); 
}