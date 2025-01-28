import { Handler } from '@netlify/functions'

interface Booking {
  id: string
  barberId: string
  date: string
  time: string
  service: string
  customerName: string
  customerEmail: string
  status: string
  createdAt: string
}

const bookings: Booking[] = []

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    }
  }

  try {
    const bookingData = JSON.parse(event.body || '{}')

    // Basic validation
    if (!bookingData.barberId || !bookingData.date || !bookingData.time || 
        !bookingData.service || !bookingData.customerName || !bookingData.customerEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      }
    }

    // Create booking using Object.assign
    const booking = Object.assign({}, bookingData, {
      id: Date.now().toString(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    })

    bookings.push(booking)

    return {
      statusCode: 201,
      body: JSON.stringify(booking),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    }
  }
} 