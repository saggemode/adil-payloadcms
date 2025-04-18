import { InvoiceService } from '@/services/invoiceService'
import { CollectionAfterChangeHook } from 'payload'

export const sendInvoice: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  try {
    // Only send invoice for new orders or when payment is completed
    if (operation === 'create' || (operation === 'update' && doc.isPaid)) {
      const invoiceContent = await InvoiceService.generateInvoice(doc)
      await InvoiceService.sendInvoice(doc, invoiceContent)

      // Update invoice delivery status
      await req.payload.update({
        collection: 'orders',
        id: doc.id,
        data: {
          invoiceDelivery: {
            ...doc.invoiceDelivery,
            status: {
              emailSent: doc.invoiceDelivery.preferences.sendEmail,
              whatsappSent: doc.invoiceDelivery.preferences.sendWhatsApp,
              smsSent: doc.invoiceDelivery.preferences.sendSMS,
              lastSentAt: new Date(),
            },
          },
        },
      })
    }
  } catch (error) {
    console.error('Failed to send invoice:', error)
    // Don't throw the error to prevent blocking the order creation/update
  }
} 