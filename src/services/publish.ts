import { TargetOrderModel } from "../models/types";
import axios from "axios";
import { logger } from "../logger";

export async function publishToWebHook(data : TargetOrderModel) : Promise<void>{
    const webHook_URL = process.env.WEBHOOK_URL;
    if(!webHook_URL){
        throw new Error("WEBHOOK_URL environment variable is not configured!");
    }
    try{
        const response = await axios.post(webHook_URL,data,{
            headers: {'Content-Type' : 'application/json' },
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