"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface ChatMessage {
  staffId: string
  from: string
  text: string
  createdAt?: string
}

interface ChatContextType {
  chatHistory: { [staffId: string]: ChatMessage[] }
  setMessages: (staffId: string, messages: ChatMessage[]) => void
  addMessage: (staffId: string, message: ChatMessage) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatHistory, setChatHistory] = useState<{ [staffId: string]: ChatMessage[] }>({})

  const setMessages = (staffId: string, messages: ChatMessage[]) => {
    setChatHistory((prev) => ({
      ...prev,
      [staffId]: messages,
    }))
  }

  const addMessage = (staffId: string, message: ChatMessage) => {
    setChatHistory((prev) => ({
      ...prev,
      [staffId]: [...(prev[staffId] || []), message],
    }))
  }

  return (
    <ChatContext.Provider value={{ chatHistory, setMessages, addMessage }}>
      {children}
    </ChatContext.Provider>
  )
}

// ✅ Custom hook for easier usage
export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error("useChat must be used within a ChatProvider")
  return context
}
