const { Server } = require('socket.io');
const { prisma } = require('../lib/prisma');

module.exports = (req, res) => {
  if (res.socket.server.io) {
    // Socket.io server is already running
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socket',
    cors: {
      origin: process.env.CLIENT_URL || "https://yazzil.com",
      methods: ["GET", "POST"],
      credentials: true
    },
    addTrailingSlash: false
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("Invalid user ID"));
    }
    
    try {
      // Verify user exists in database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, isAdmin: true }
      });
      
      if (!user) {
        return next(new Error("User not found"));
      }
      
      // Attach user data to socket
      socket.data.user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  io.on('connection', async (socket) => {
    const user = socket.data.user;
    console.log(`Client connected: ${socket.id}, User: ${user.id}`);
    
    // Join user to their own room
    socket.join(`user:${user.id}`);
    
    // If user is admin, join admin room
    if (user.isAdmin) {
      socket.join('admins');
      console.log(`Admin ${user.id} joined admin room`);
    }
    
    // Handle chat messages
    socket.on('send_message', async (data) => {
      try {
        const { content, senderId, receiverId, isFromAdmin } = data;
        
        // Store message in database
        const message = await prisma.chatMessage.create({
          data: {
            content,
            senderId,
            receiverId,
            isFromAdmin,
            isRead: false
          }
        });
        
        // Format message for clients
        const messageData = {
          ...message,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString()
        };
        
        // Emit to specific user's room
        if (receiverId) {
          io.to(`user:${receiverId}`).emit('new_message', messageData);
        }
        
        // Also emit to admins if message is from regular user
        if (!isFromAdmin) {
          io.to('admins').emit('new_message', messageData);
        }
        
        // Return confirmation to sender
        socket.emit('message_sent', {
          success: true,
          messageId: message.id
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_sent', {
          success: false,
          error: 'Failed to send message'
        });
      }
    });
    
    // Handle marking messages as read
    socket.on('mark_as_read', async (messageId) => {
      try {
        await prisma.chatMessage.update({
          where: { id: messageId },
          data: { isRead: true }
        });
        
        socket.emit('message_marked_read', {
          success: true,
          messageId
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
        socket.emit('message_marked_read', {
          success: false,
          error: 'Failed to mark message as read'
        });
      }
    });
    
    // Handle typing indicators
    socket.on('user_typing', (data) => {
      // Forward typing indicator to admins
      io.to('admins').emit('user_typing', {
        userId: user.id,
        typing: data.typing
      });
    });
    
    socket.on('admin_typing', (data) => {
      // Forward typing indicator to specific user
      if (data.userId) {
        io.to(`user:${data.userId}`).emit('admin_typing', {
          typing: data.typing
        });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Store the io instance on the server
  res.socket.server.io = io;
  res.end();
};