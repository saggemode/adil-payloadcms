import { Order } from '@/payload-types'
import { Resend } from 'resend'
import { Vonage } from '@vonage/server-sdk'
import { Auth } from '@vonage/auth'
import { Channels } from '@vonage/messages'
//import { WhatsApp } from '@vonage/messages'

// Initialize services
const resend = new Resend(process.env.RESEND_API_KEY)
const vonage = new Vonage(
  new Auth({
    apiKey: process.env.VONAGE_API_KEY || '',
    apiSecret: process.env.VONAGE_API_SECRET || '',
  })
)

export class InvoiceService {
  static async generateInvoice(order: Order) {
    // Get the default invoice template
    const template = await this.getDefaultTemplate()
    
    // Replace template variables with actual order data
    const invoiceContent = this.replaceTemplateVariables(template, order)
    
    return invoiceContent
  }

  static async sendInvoice(order: Order, invoiceContent: string) {
    const preferences = order.invoiceDelivery?.preferences || {
      sendEmail: true,
      sendWhatsApp: false,
      sendSMS: false
    }

    if (preferences.sendEmail) {
      await this.sendEmailInvoice(order, invoiceContent)
    }

    if (preferences.sendWhatsApp) {
      await this.sendWhatsAppInvoice(order, invoiceContent)
    }

    if (preferences.sendSMS) {
      await this.sendSMSInvoice(order, invoiceContent)
    }
  }

  private static async sendEmailInvoice(order: Order, invoiceContent: string) {
    try {
      const userEmail = typeof order.user === 'object' ? order.user.email : ''
      await resend.emails.send({
        from: 'invoices@yourdomain.com',
        to: userEmail,
        subject: `Invoice for Order #${order.id}`,
        html: invoiceContent,
      })
    } catch (error) {
      console.error('Failed to send email invoice:', error)
      throw error
    }
  }

  private static async sendWhatsAppInvoice(order: Order, invoiceContent: string) {
    try {
      const fromNumber = process.env.VONAGE_WHATSAPP_NUMBER || ''
      await vonage.messages.send({
        to: order.shippingAddress.phone,
        from: fromNumber,
        channel: Channels.WHATSAPP,
        text: `Your invoice for Order #${order.id}:\n\n${invoiceContent}`,
      })
    } catch (error) {
      console.error('Failed to send WhatsApp invoice:', error)
      throw error
    }
  }

  private static async sendSMSInvoice(order: Order, invoiceContent: string) {
    try {
      const fromNumber = process.env.VONAGE_SMS_NUMBER || ''
      await vonage.sms.send({
        to: order.shippingAddress.phone,
        from: fromNumber,
        text: `Your invoice for Order #${order.id}:\n\n${invoiceContent}`,
      })
    } catch (error) {
      console.error('Failed to send SMS invoice:', error)
      throw error
    }
  }

  private static async getDefaultTemplate() {
    // TODO: Implement template fetching from the database
    return `
      <h1>Invoice #{{orderId}}</h1>
      <p>Customer: {{customerName}}</p>
      <p>Date: {{orderDate}}</p>
      <h2>Items:</h2>
      {{items}}
      <p>Total: {{totalPrice}}</p>
      <p>Shipping Address: {{shippingAddress}}</p>
    `
  }

  private static replaceTemplateVariables(template: string, order: Order) {
    return template
      .replace('{{orderId}}', order.id.toString())
      .replace('{{customerName}}', order.shippingAddress.fullName)
      .replace('{{orderDate}}', new Date(order.createdAt).toLocaleDateString())
      .replace('{{items}}', this.formatOrderItems(order.items || []))
      .replace('{{totalPrice}}', order.totalPrice.toString())
      .replace('{{shippingAddress}}', this.formatShippingAddress(order.shippingAddress))
  }

  private static formatOrderItems(items: any[]) {
    return items.map(item => `
      <div>
        <p>${item.name} - ${item.quantity} x $${item.price}</p>
      </div>
    `).join('')
  }

  private static formatShippingAddress(address: any) {
    return `
      ${address.fullName}<br>
      ${address.street}<br>
      ${address.city}, ${address.province} ${address.postalCode}<br>
      ${address.country}
    `
  }
} 