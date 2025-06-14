// "use client"

// import { useEffect, useRef, useState } from "react"
// import Pusher from "pusher-js"

// interface UsePusherOptions {
//   appKey: string
//   cluster: string
//   authEndpoint?: string
//   enableLogging?: boolean
// }

// interface PusherHookReturn {
//   pusher: Pusher | null
//   isConnected: boolean
//   subscribe: (channelName: string) => any
//   unsubscribe: (channelName: string) => void
//   trigger: (channelName: string, eventName: string, data: any) => void
// }

// export const usePusher = (options: UsePusherOptions): PusherHookReturn => {
//   const [pusher, setPusher] = useState<Pusher | null>(null)
//   const [isConnected, setIsConnected] = useState(false)
//   const channelsRef = useRef<Map<string, any>>(new Map())

//   useEffect(() => {
//     // Initialize Pusher
//     const pusherInstance = new Pusher(options.appKey, {
//       cluster: options.cluster,
//       authEndpoint: options.authEndpoint,
//       enabledTransports: ["ws", "wss"],
//       forceTLS: true,
//     })

//     // Connection event handlers
//     pusherInstance.connection.bind("connected", () => {
//       console.log("Pusher connected")
//       setIsConnected(true)
//     })

//     pusherInstance.connection.bind("disconnected", () => {
//       console.log("Pusher disconnected")
//       setIsConnected(false)
//     })

//     pusherInstance.connection.bind("error", (error: any) => {
//       console.error("Pusher connection error:", error)
//       setIsConnected(false)
//     })

//     setPusher(pusherInstance)

//     return () => {
//       // Cleanup all channels
//       channelsRef.current.forEach((channel, channelName) => {
//         pusherInstance.unsubscribe(channelName)
//       })
//       channelsRef.current.clear()

//       pusherInstance.disconnect()
//     }
//   }, [options.appKey, options.cluster, options.authEndpoint])

//   const subscribe = (channelName: string) => {
//     if (!pusher) return null

//     if (channelsRef.current.has(channelName)) {
//       return channelsRef.current.get(channelName)
//     }

//     const channel = pusher.subscribe(channelName)
//     channelsRef.current.set(channelName, channel)
//     return channel
//   }

//   const unsubscribe = (channelName: string) => {
//     if (!pusher) return

//     pusher.unsubscribe(channelName)
//     channelsRef.current.delete(channelName)
//   }

//   const trigger = (channelName: string, eventName: string, data: any) => {
//     const channel = channelsRef.current.get(channelName)
//     if (channel) {
//       channel.trigger(eventName, data)
//     }
//   }

//   return {
//     pusher,
//     isConnected,
//     subscribe,
//     unsubscribe,
//     trigger,
//   }
// }

"use client"

import { useEffect, useRef, useState } from "react"
import { pusherClient } from "@/lib/pusher"

interface PusherHookReturn {
  pusher: typeof pusherClient
  isConnected: boolean
  subscribe: (channelName: string) => any
  unsubscribe: (channelName: string) => void
}

export const usePusher = (): PusherHookReturn => {
  const [isConnected, setIsConnected] = useState(false)
  const channelsRef = useRef<Map<string, any>>(new Map())

  useEffect(() => {
    const handleConnected = () => {
      console.log("Pusher connected")
      setIsConnected(true)
    }

    const handleDisconnected = () => {
      console.log("Pusher disconnected")
      setIsConnected(false)
    }

    const handleError = (error: any) => {
      console.error("Pusher connection error:", error)
      setIsConnected(false)
    }

    pusherClient.connection.bind("connected", handleConnected)
    pusherClient.connection.bind("disconnected", handleDisconnected)
    pusherClient.connection.bind("error", handleError)

    setIsConnected(pusherClient.connection.state === "connected")

    return () => {
      pusherClient.connection.unbind("connected", handleConnected)
      pusherClient.connection.unbind("disconnected", handleDisconnected)
      pusherClient.connection.unbind("error", handleError)

      channelsRef.current.forEach((channel, channelName) => {
        pusherClient.unsubscribe(channelName)
      })
      channelsRef.current.clear()
    }
  }, [])

  const subscribe = (channelName: string) => {
    if (channelsRef.current.has(channelName)) {
      return channelsRef.current.get(channelName)
    }

    const channel = pusherClient.subscribe(channelName)
    channelsRef.current.set(channelName, channel)
    return channel
  }

  const unsubscribe = (channelName: string) => {
    pusherClient.unsubscribe(channelName)
    channelsRef.current.delete(channelName)
  }

  return {
    pusher: pusherClient,
    isConnected,
    subscribe,
    unsubscribe,
  }
}
