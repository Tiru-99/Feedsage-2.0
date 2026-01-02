
import Redis from "ioredis";

export class Subscriber {
    private channel: string;
    private subClient: Redis;
    private isSubscribed = false; 

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

        const handler = (channel: string, message: string) => {
            if (channel === this.channel) {
                onMessage(message);
            }
        }

        this.subClient.on("message", handler)
        this.subClient.on("error", onError);
        //cleanup
        return () => {
            this.subClient.off("message", handler);
            this.subClient.off("error", onError);
            this.subClient.unsubscribe(this.channel);
            this.subClient.disconnect(); 
        }
    }
}