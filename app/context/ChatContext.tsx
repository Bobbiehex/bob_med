"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Message = {
  staffId: string
  from: string
  text: string
  createdAt?: string
}

type ChatContextType = {
  chatHistory: { [staffId: string]: Message[] }
  addMessage: (staffId: string, message: Message) => void
  setMessages: (staffId: string, messages: Message[]) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatHistory, setChatHistoryState] = useState<{ [staffId: string]: Message[] }>({})

  const addMessage = (staffId: string, message: Message) => {
    setChatHistoryState((prev) => ({
      ...prev,
      [staffId]: [...(prev[staffId] || []), message],
    }))
  }

  const setMessages = (staffId: string, messages: Message[]) => {
    setChatHistoryState((prev) => ({
      ...prev,
      [staffId]: messages,
    }))
  }

  return (
    <ChatContext.Provider value={{ chatHistory, addMessage, setMessages }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
