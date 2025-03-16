import { CollectionBeforeChangeHook } from 'payload'

export const validateDatesAndStatus: CollectionBeforeChangeHook = ({ data, operation }) => {
  // Ensure dates are valid
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    if (start >= end) {
      throw new Error('End date must be after start date')
    }
  }

  // Auto-update status based on dates
  if (operation === 'create' || operation === 'update') {
    const now = new Date()
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)

    if (data.status !== 'draft' && data.status !== 'cancelled') {
      if (now < start) {
        data.status = 'scheduled'
      } else if (now >= start && now <= end) {
        data.status = 'active'
      } else if (now > end) {
        data.status = 'completed'
      }
    }
  }

  return data
}
