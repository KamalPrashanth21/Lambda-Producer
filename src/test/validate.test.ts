import { ValidateInput } from "../validate";

    describe("validateInput",()=>{
        const inputData = {
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
        };
        
        test("test should pass with valid Input",()=>{
            const result = ValidateInput(inputData);
            expect(result.valid).toBe(true);
        });

        test("test should fail if orderId is missing",()=>{
            const arr : any = {...inputData};
            delete arr.orderId;
            const result = ValidateInput(arr);
            expect(result.valid).toBe(false);
        });

        test("test should fail for invalid orderDate format", () => {
            const arr = { ...inputData, orderDate: "2023-10-15" };
            const result = ValidateInput(arr);
            expect(result.valid).toBe(false);
        });

        test("test should fail for invalid status value", () => {
            const arr = { ...inputData, status: "INVALID" };
            const result = ValidateInput(arr);
            expect(result.valid).toBe(false);
        });

        test("test should fail for missing status",()=>{
            const arr :any = {...inputData};
            delete arr.status;
            const result = ValidateInput(arr);
            expect(result.valid).toBe(false);
        })

        test("test should fail for invalid storeId type", () => {
            const arr = { ...inputData, storeId: "forty-two" };
            const result = ValidateInput(arr);
            expect(result.valid).toBe(false);
        }); 
        
        test("test should fail if item is missing sku", () => {
            const arr = {
            ...inputData,
            items: [{ quantity: 2, unitPrice: 10.0 }],
            };
            const result = ValidateInput(arr);
            expect(result.valid).toBe(false);
        });

        test("test should fail if discountAmount is not a number", () => {
            const arr = {
                ...inputData,
                items: [{ sku: "PROD-001", quantity: 1, unitPrice: 10.0, discountAmount: "five" }],
            };
            const result = ValidateInput(arr);
            expect(result.valid).toBe(false);
        });

        test("test should fail if items is an empty array", () => {
            const arr = {...inputData,items:[]};
            const result = ValidateInput(arr);
            expect(result.valid).toBe(false);
        });
});
