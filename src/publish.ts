import { TargetOrderModel } from "./types";
import axios from "axios";
import { logger } from "./logger";

const webHook_URL = process.env.WEBHOOK_URL;

export async function publishToWebHook(data : TargetOrderModel) : Promise<void>{
    if(!webHook_URL){
        throw new Error("No URL in environmental variables");
    }
    try{
        const response = await axios.post(webHook_URL,data,{
            headers: {'Content-Type' : 'application/json' }, //can also be optional. Only URL, data is reqd
        });
        logger({
            level : 'INFO',
            message : 'Data has been published successfully to Webhook.site',
            context:{
                statusCode: 200,
            }
        });
    }
    catch(error : any){
        logger({
            level: 'ERROR',
            message: 'Webhook call failed',
            context: {
                errorMessage: error.message,
                orderId: data.order.id,
            }
         });
        throw error;
    }
};