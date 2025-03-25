import { Server } from 'socket.io'
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  const payload = await getPayload({ config: configPromise })

  // WebSocket connection handling
  io.on('connection', (socket) => {
    console.log('Client connected')

    // Handle authentication
    socket.on('authenticate', async (token) => {
      try {
        const requestHeaders = new Headers()
        requestHeaders.set('authorization', `JWT ${token}`)

        const { user } = await payload.auth({
          headers: requestHeaders,
        })
        if (user) {
          socket.data.user = user
          socket.emit('authenticated', { success: true })
        }
      } catch (error) {
        socket.emit('authenticated', { success: false, error: 'Authentication failed' })
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  // Start server
  const PORT = process.env.WS_PORT || 3001
  server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`)
  })
})
