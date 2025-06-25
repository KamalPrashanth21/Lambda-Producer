import { SourceOrderData, TargetOrderModel } from "./types";
import { Transform } from "./transform";
import { ValidateInput } from "./validate";
import dotenv from 'dotenv';
import {publishToWebHook} from "./publish";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { logger } from "./logger";

dotenv.config();

export const LambdaHandler = async(event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try{
        if(event.path.endsWith('/healthCheck') && event.httpMethod==='GET'){
            return {
                statusCode : 200,
                body : JSON.stringify({status:'ok'}),
            };
        }

        if(!event.body){
            return{
                statusCode : 400,
                body : JSON.stringify({error : "Input Request Body is missing"}),
            };
        }
        const payload = JSON.parse(event.body);

        logger({
            level: 'INFO',
            message: 'Incoming request received',
            context: {
                path: event.path,
                httpMethod: event.httpMethod,
            }
        });

        const validatedData = ValidateInput(payload);
        if(!validatedData.valid){
            return {
                statusCode : 400,
                body : JSON.stringify({error: validatedData.errors}),
            };
        }

        const source : SourceOrderData = payload;
        const targetData = Transform(source);

        await publishToWebHook(targetData); 

        return { 
            statusCode : 200,
            body : JSON.stringify({message : "Data has been published successfully!"}),
        };
    }
    
    catch(error : any){
        console.error("An error has occured", error);
        return{
            statusCode : 500,
            body : JSON.stringify({error : "An internal server error has occured!"}),
        };
    };   

}
