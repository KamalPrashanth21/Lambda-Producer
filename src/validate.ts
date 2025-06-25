interface ValidationResult {
    valid : boolean;
    errors?: string[];
}

export function ValidateInput (data : any) : ValidationResult{ 
    const errors : string[] = [];

    if (!data.orderId || typeof data.orderId !== 'string')errors.push("OrderId is required and it must be a string");
    if (typeof data.orderDate !== 'string') errors.push('orderDate is required and must be a string.');
    if (!data.customerId || typeof data.customerId !== 'string') errors.push('customerId is required and must be a string.');
    if (!data.storeId || typeof data.storeId !== 'number') errors.push('storeId is required and must be a number.');
    if (!Array.isArray(data.items) || data.items.length === 0) errors.push('items must be a non-empty array.');
    if (!data.paymentMethod || typeof data.paymentMethod !== 'string') errors.push('paymentMethod is required and must be a string.');
    if (!data.totalAmount || typeof data.totalAmount !== 'number') errors.push('totalAmount is required and must be a number.');
    if (!data.status || typeof data.status !== 'string') errors.push('status is required and must be a string.');

    const allowedStatuses = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!data.status || !allowedStatuses.includes(data.status)) {
        errors.push(`status should be one of the following : ${allowedStatuses.join(', ')}`);
    }

    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[0-1])\/\d{4}$/;
    if (!data.orderDate || !datePattern.test(data.orderDate) || isNaN(Date.parse(data.orderDate))) {
        errors.push('orderDate should be in MM/DD/YYYY format.');
    }

    if (Array.isArray(data.items)) {
    data.items.forEach((item: any, index: number) => {
      if (!item.sku || typeof item.sku !== 'string') errors.push(`items[${index}].sku is required and must be a string.`);
      if (!item.quantity || typeof item.quantity !== 'number') errors.push(`items[${index}].quantity is required and must be a number.`);
      if (!item.unitPrice || typeof item.unitPrice !== 'number') errors.push(`items[${index}].unitPrice  is required and must be a number.`);
      if (item.discountAmount !== undefined && typeof item.discountAmount !== 'number') {
        errors.push(`items[${index}].discountAmount must be a number if provided.`);
            }
        });
    }

    if (data.shippingAddress) {
        const address = data.shippingAddress;

        if (address.street && typeof address.street !== 'string')errors.push('shippingAddress.street must be a string.');
        if (address.city && typeof address.city !== 'string')errors.push('shippingAddress.city must be a string.');
        if (address.state && typeof address.state !== 'string')errors.push('shippingAddress.state must be a string.');
        if (address.zipCode && typeof address.zipCode !== 'string')errors.push('shippingAddress.zipCode must be a string.');
        if (address.country && typeof address.country !== 'string')errors.push('shippingAddress.country must be a string.');
    }

      return errors.length === 0
    ? { valid: true }
    : { valid: false, errors };

} 