import { Handler } from '@netlify/functions'

interface TimeSlot {
  time: string
  available: boolean
}

interface WorkingHours {
  start: number
  end: number
  interval: number
}

const WORKING_HOURS: WorkingHours = {
  start: 9, // 9 AM
  end: 17, // 5 PM
  interval: 30, // 30 minutes per slot
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    }
  }

  try {
    const params = event.queryStringParameters || {}
    const { date, barberId } = params

    if (!date || !barberId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Date and barberId are required' }),
      }
    }

    // Generate time slots
    const slots: TimeSlot[] = []
    for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += WORKING_HOURS.interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time: timeString,
          available: true, // In a real app, check against bookings
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(slots),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    }
  }
} 