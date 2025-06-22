import { TargetOrderModel } from "./types";
import axios from "axios";

const webHook_URL = process.env.WEBHOOK_URL;

export async function publishToWebHook(data : TargetOrderModel) : Promise<void>{
    if(!webHook_URL){
        throw new Error("No URL in environmental variables");
    }
    try{
        const response = await axios.post(webHook_URL,data,{
            headers: {'Content-Type' : 'application/json' }, //can also be optional. Only URL, data is reqd
        });
        console.log(`The data has been published in webHook.site with Status : ${response.status} and response body : ${response.data}`);
    }
    catch(error : any){
        throw new Error("Webhook publish operation failed!");
    }
};