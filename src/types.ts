
export interface SourceOrderData {
  orderId: string;
  orderDate: string; // Required: Date in MM/DD/YYYY format
  customerId: string; // Required: Customer identifier
  storeId: number; // Required: Store where order was placed
  items: {
    sku: string; // Required: Product SKU
    quantity: number; // Required: Quantity ordered
    unitPrice: number; // Required: Price per unit
    discountAmount?: number;     // Optional: Discount applied
  }[]; // Required: At least one item
  paymentMethod: string; // Required: Payment method used
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }; // Optional: Shipping address
  totalAmount: number; // Required: Total order amount
  status: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'; // Required: Order status
  notes?: string; // Optional: Additional notes
}

export interface TargetOrderModel {
  order: {
    id: string; // Order ID
    createdAt: string; // ISO format date (YYYY-MM-DD)
    customer: {
      id: string; // Customer ID
    };
    location: {
      storeId: string; // Store ID as string
    };
    status: string; // Normalized status
    payment: {
      method: string; // Payment method
      total: number; // Total amount
    };
    shipping: {
      address: {
        line1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    };
  };
  items: {
    productId: string; // Product SKU
    quantity: number; // Quantity
    price: {
      base: number; // Unit price
      discount: number; // Discount (0 if none)
      final: number; // Final price after discount
    };
  }[];
  metadata: {
    source: string; // Source system identifier
    notes: string; // Notes (empty string if none)
    processedAt: string; // ISO timestamp of processing
  };
}
