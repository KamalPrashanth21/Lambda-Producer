import { Transform } from "../transform";
import { SourceOrderData } from "../types";

describe("transform",()=>{
    const validData : SourceOrderData = {
            "orderId": "ORD-12345",
            "orderDate": "10/15/2023",
            "customerId": "CUST-789",
            "storeId": 42,
            "items": [
                {
                    "sku": "PROD-001",
                    "quantity": 2,
                    "unitPrice": 29.99,
                    "discountAmount": 5.00
                },
                {
                    "sku": "PROD-002",
                    "quantity": 1,
                    "unitPrice": 49.99
                }
            ],
            "paymentMethod": "CREDIT_CARD",
            "totalAmount": 104.97,
            "status": "NEW",
            "notes": "Please deliver after 5pm"
        }

        test("test should transform all the fields correctly",()=>{
            const result = Transform(validData);

            expect(result.order.id).toBe("ORD-12345");
            expect(result.order.createdAt).toBe("2023-10-15");
            expect(result.order.customer.id).toBe("CUST-789");
            expect(result.order.location.storeId).toBe("42");
            expect(result.order.status).toBe("new");
            expect(result.order.payment.method).toBe("CREDIT_CARD");
            expect(result.order.payment.total).toBe(104.97);
            expect(result.metadata.notes).toBe("Please deliver after 5pm");
        });

        test("test should default optional fields if missing",()=>{
            const arr = {...validData};
            delete arr.notes;
            delete arr.shippingAddress;
            delete arr.items[0].discountAmount;
            
            const result = Transform(arr);

            expect(result.metadata.notes).toBe("");
            expect(result.order.shipping.address.line1).toBe("");
            expect(result.items[0].price.discount).toBe(0);
        });
    });