import { SourceOrderData, TargetOrderModel } from "./types";
import { Transform } from "./transform";
import { ValidateInput } from "./validate";
import dotenv from 'dotenv';
import {publishToWebHook} from "./publish";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";


export const LambdaHandler = async(event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try{
        if(!event.body){
            return{
                statusCode : 400,
                body : JSON.stringify({error : "Input Request Body is missing"}), //key-value pair
            };
        }
        const payload = JSON.parse(event.body);

        const validatedData = ValidateInput(payload);//validation
        if(!validatedData.valid){
            return {
                statusCode : 400,
                body : JSON.stringify({error: validatedData.errors}),
            };
        }

        const source : SourceOrderData = payload;
        const targetData = Transform(source);

        await publishToWebHook(targetData); 

        return { //successful response
            statusCode : 200,
            body : JSON.stringify({message : "Data has been published successfully!"}),
        }; //after all provessing has been done successfully we return a success msg
    }
    
    catch(error : any){
        console.error("An error has occured", error);
        return{
            statusCode : 500,
            body : JSON.stringify({error : "An internal server error has occured!"}),
        };
    };   

}
