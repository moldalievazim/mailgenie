"use server";
// TODO: Add server actions
// Example:
"use server";
export const onGetDomainChatRooms = async (domain: string) => {
  // Use Prisma to find all chatrooms for a domain
};

// TODO: Add these server actions:
export const onToggleRealtime = async (id: string, state: boolean) => {
  // Update real-time mode for a chatroom
};

export const onGetConversationMode = async (id: string) => {
  // Return realtime status of chatroom
};

export const onGetChatMessages = async (id: string) => {
  // Return messages in a chatroom
};

export const onViewUnReadMessages = async (roomId: string) => {
  // Update all unseen messages to seen for this chatroom
};

export const onOwnerSendMessage = async (
  chatroomId: string,
  message: string,
  role: "user" | "assistant"
) => {
  // Save the message to the database with role
};

export const onRealTimeChat = async (
  chatroomId: string,
  message: string,
  id: string,
  role: "assistant" | "user"
) => {
  // Use pusherServer.trigger() to broadcast the new message
};
