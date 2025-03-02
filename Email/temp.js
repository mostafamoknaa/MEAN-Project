export function emailTemplate(orderData) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; background: #007bff; padding: 15px; color: white; font-size: 20px; font-weight: bold; border-radius: 8px 8px 0 0; }
        .order-details { padding: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .total { font-weight: bold; font-size: 18px; }
        .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #555; }
        .button { background: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Thank You for Your Order!</div>

        <div class="order-details">
            <p>Hi <strong>${orderData.customerName}</strong>,</p>
            <p>Your order has been successfully placed!</p>

            <h3>Order Summary:</h3>
            <table class="table">
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
                ${orderData.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price}</td>
                    </tr>
                `).join("")}
                <tr>
                    <td colspan="2" class="total">Total Amount:</td>
                    <td class="total">$${orderData.totalAmount}</td>
                </tr>
            </table>

            <h3>Shipping Address:</h3>
            <p>${orderData.shippingAddress}</p>

            <h3>Payment Method:</h3>
            <p>${orderData.paymentMethod}</p>

            <p>Your order will be processed soon. You will receive another email once it has been shipped.</p>

            <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact us</a>.</p>
        </div>

        <div class="footer">
            &copy; ${new Date().getFullYear()} E-Learning System | All Rights Reserved.
        </div>
    </div>
</body>
</html>`;
}