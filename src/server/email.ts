import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export const sendEmail = async ({
  to,
  subject,
  html,
  from = 'noreply@yourdomain.com',
}: EmailOptions) => {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

// Email templates
export const templates = {
  orderConfirmation: (order: any) => ({
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order Number: ${order.orderNumber}</p>
      <p>Total Amount: $${order.total}</p>
      <h2>Order Details:</h2>
      <ul>
        ${order.items
          .map(
            (item: any) => `
          <li>${item.name} x ${item.quantity} - $${item.price * item.quantity}</li>
        `,
          )
          .join('')}
      </ul>
    `,
  }),

  lowStockAlert: (product: any) => ({
    subject: `Low Stock Alert - ${product.name}`,
    html: `
      <h1>Low Stock Alert</h1>
      <p>Product: ${product.name}</p>
      <p>Current Stock: ${product.stock}</p>
      <p>Threshold: ${product.stockThreshold}</p>
      <p>Please restock this product soon.</p>
    `,
  }),

  saleNotification: (sale: any) => ({
    subject: `New Sale - $${sale.total}`,
    html: `
      <h1>New Sale Notification</h1>
      <p>Sale ID: ${sale.id}</p>
      <p>Total Amount: $${sale.total}</p>
      <p>Product: ${sale.product.name}</p>
      <p>Quantity: ${sale.quantity}</p>
    `,
  }),
}
