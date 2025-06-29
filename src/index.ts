import { SourceOrderData, TargetOrderModel } from "./models/types";
import { Transform } from "./services/transform";
import { ValidateInput } from "./services/validate";
import {publishToWebHook} from "./services/publish";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { logger } from "./logger";

export const lambdaHandler = async(event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try{
        if (!process.env.WEBHOOK_URL) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        status: 'error',
                        error: 'WEBHOOK_URL environment variable is not configured!',
                    }),
                };
            }
        if(event.path.endsWith('/healthCheck') && event.httpMethod==='GET'){
            return{
                statusCode : 200,
                body : JSON.stringify({
                    status:'ok',
                    message:'Lambda is healthy!'
                }),
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
            statusCode : error.statusCode,
            body : JSON.stringify({error : "An internal server error has occured!"}),
        };
    };   

}
