import { SourceOrderData, TargetOrderModel } from "./types";
import { formatDatetoISO } from "./utils";
import { logger } from "./logger";

export function Transform(source : SourceOrderData) : TargetOrderModel{
    try{
    const createdAt = formatDatetoISO(source.orderDate);
    const transformed : TargetOrderModel = {
        order : {
            id : source.orderId,
            createdAt,
            customer : {
                id : source.customerId,
            },
            location : {
              storeId : source.storeId.toString(),  
            },
            status : source.status.toLowerCase(),
            payment : {
                method : source.paymentMethod,
                total  :source.totalAmount,
            },
            shipping : {
                address : {
                    line1 : source.shippingAddress?.street || '',
                    city : source.shippingAddress?.city || '',
                    state : source.shippingAddress?.state || '',
                    postalCode : source.shippingAddress?.zipCode || '',
                    country : source.shippingAddress?.country || '', 
                },
            },
        },
        items : source.items.map((item)=> {
                const dicount = item.discountAmount ?? 0;
                const finalAmount = item.quantity * (item.unitPrice-dicount);
                return {
                    productId : item.sku,
                    quantity : item.quantity ,
                    price : {
                        base : item.unitPrice,
                        discount : dicount,
                        final : finalAmount,
                    },
                };
            }),
            metadata : {
            source : "order_producer",
            notes : source.notes || '',
            processedAt : new Date().toISOString(),
        },
    };

    logger({
        level : 'INFO',
        message : "Successfully transformed the data!",
        context : {
            userId: source.customerId, 
            orderId: source.orderId,
        },
    });
    return transformed;
    }
    catch(error: any){
        logger({
            level: 'ERROR', 
            message: 'Transformation failed', 
            context: { 
                errorMessage: error.message,
                orderId: source.orderId,
            }
        });
        throw error;
    }   
}