
import Redis from "ioredis";

export class Subscriber {
    private channel: string;
    private subClient: Redis;
    private isSubscribed = false; 
    private messageHandler? : ( message : string , channel : string) => void ; 
    private errorHandler? : (err : Error) => void

    constructor(channel: string, subClient: Redis) {
        this.channel = channel;
        this.subClient = subClient;
    }

    public subscribe(
        onMessage: (message: string) => void,
        onError: (error: Error) => void
    ) {
        if(this.isSubscribed){
            onError(
                new Error("Already subscribed")
            );
            return ;
        }

        this.subClient.subscribe(this.channel, (err) => {
            if (err) {
                onError(
                    new Error(
                        `Something went wrong while connecting to ${this.channel}: ${err.message}`
                    )
                );
                return ; 
            }
            this.isSubscribed = true ; 
        });

        this.messageHandler = (channel: string, message: string) => {
            if (channel === this.channel) {
                onMessage(message);
            }
        }

        this.errorHandler = onError ; 
        this.subClient.on("message", this.messageHandler)
        this.subClient.on("error", this.errorHandler);
    }

    public unsubscribe(){
        if(this.messageHandler){
            this.subClient.off("message" , this.messageHandler); 
        }
        if(this.errorHandler){
            this.subClient.off("error", this.errorHandler);
        }
        this.subClient.unsubscribe(this.channel);
        this.subClient.disconnect(); 
    }

}