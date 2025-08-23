"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// ✅ bring in ChatContext
import { useChat } from "@/context/ChatContext"

export default function StaffPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingStaff, setBookingStaff] = useState<any>(null)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingReason, setBookingReason] = useState("")

  // ✅ from ChatContext
  const { chatHistory, addMessage, setMessages } = useChat()

  const loggedInUserId = "replace_with_actual_user_id"

  const doctors = [
    { id: "doc1", name: "Dr. Sarah Johnson", role: "Cardiologist", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: "doc2", name: "Dr. David Kim", role: "Neurologist", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: "doc3", name: "Dr. Emily White", role: "Pediatrician", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: "doc4", name: "Dr. James Lee", role: "Orthopedic Surgeon", img: "https://randomuser.me/api/portraits/men/28.jpg" },
    { id: "doc5", name: "Dr. Olivia Martinez", role: "Dermatologist", img: "https://randomuser.me/api/portraits/women/12.jpg" },
  ]

  const nurses = [
    { id: "nurse1", name: "Nurse Grace Adebayo", role: "Head Nurse", img: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: "nurse2", name: "Nurse Peter Mensah", role: "ICU Nurse", img: "https://randomuser.me/api/portraits/men/41.jpg" },
    { id: "nurse3", name: "Nurse Hannah Okoro", role: "Emergency Nurse", img: "https://randomuser.me/api/portraits/women/50.jpg" },
    { id: "nurse4", name: "Nurse Kelvin Yusuf", role: "Surgical Nurse", img: "https://randomuser.me/api/portraits/men/46.jpg" },
    { id: "nurse5", name: "Nurse Mary Eze", role: "Pediatric Nurse", img: "https://randomuser.me/api/portraits/women/28.jpg" },
    { id: "nurse6", name: "Nurse Chidi Nwachukwu", role: "General Ward Nurse", img: "https://randomuser.me/api/portraits/men/60.jpg" },
    { id: "nurse7", name: "Nurse Sophia Adeyemi", role: "Community Health Nurse", img: "https://randomuser.me/api/portraits/women/20.jpg" },
  ]

  // ✅ Fetch messages safely
  const fetchMessages = async (staffId: string) => {
    try {
      const res = await fetch(`/api/messages?staffId=${staffId}&userId=${loggedInUserId}`)
      if (!res.ok) return
      const data = await res.json()
      if (!Array.isArray(data)) return
      setMessages(staffId, data)
    } catch (err) {
      console.error("Failed to fetch messages:", err)
    }
  }

  const handleChatOpen = (staff: any) => {
    setSelectedStaff(staff)
    setIsChatOpen(true)
    fetchMessages(staff.id)
  }

  const handleBookingOpen = (staff: any) => {
    setBookingStaff(staff)
    setIsBookingOpen(true)
  }

  useEffect(() => {
    if (!selectedStaff) return
    const interval = setInterval(() => fetchMessages(selectedStaff.id), 2000)
    return () => clearInterval(interval)
  }, [selectedStaff])

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedStaff) return
    setIsTyping(true)
    const textToSend = message
    setMessage("")

    // ✅ Optimistic update in context
    addMessage(selectedStaff.id, { staffId: selectedStaff.id, from: "You", text: textToSend })

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: selectedStaff.id,
          userId: loggedInUserId,
          from: "You",
          text: textToSend,
        }),
      })
      if (!res.ok) console.error("Failed to save message to database")
      else {
        const savedMessage = await res.json()
        addMessage(selectedStaff.id, savedMessage)
      }
    } catch (err) {
      console.error("Failed to send message:", err)
    } finally {
      setIsTyping(false)
    }
  }

  // --- Booking code remains unchanged ---
  const fetchExistingBookings = async (staffId: string) => {
    try {
      const res = await fetch(`/api/bookings?staffId=${staffId}`)
      if (!res.ok) return []
      const data = await res.json()
      if (!Array.isArray(data)) return []
      return data
    } catch (err) {
      console.error("Failed to fetch bookings:", err)
      return []
    }
  }

  const handleConfirmBooking = async () => {
    if (!bookingStaff || !bookingDate || !bookingTime || !bookingReason) {
      alert("Please fill all booking details")
      return
    }

    const existingBookings = await fetchExistingBookings(bookingStaff.id)
    const conflict = existingBookings.find((b) => b.date === bookingDate && b.time === bookingTime)
    if (conflict) {
      alert("This slot is already booked. Please choose another time.")
      return
    }

    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: bookingStaff.id,
          staffName: bookingStaff.name,
          date: bookingDate,
          time: bookingTime,
          reason: bookingReason,
        }),
      })
      alert(`Appointment booked with ${bookingStaff.name}!`)
      setIsBookingOpen(false)
      setBookingDate("")
      setBookingTime("")
      setBookingReason("")
    } catch (err) {
      console.error("Failed to create booking:", err)
      alert("Failed to book appointment. Try again.")
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Doctors */}
      <section>
        <h2 className="text-xl font-bold mb-4">👨‍⚕️ Doctors</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((staff) => (
            <Card key={staff.id} className="rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={staff.img} alt={staff.name} />
                  <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{staff.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{staff.role}</p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button className="w-full flex items-center gap-2" onClick={() => handleChatOpen(staff)}>
                  <MessageCircle className="w-4 h-4" /> Chat
                </Button>
                <Button
                  className="w-full flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleBookingOpen(staff)}
                >
                  📅 Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Nurses */}
      <section>
        <h2 className="text-xl font-bold mb-4">👩‍⚕️ Nurses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nurses.map((staff) => (
            <Card key={staff.id} className="rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={staff.img} alt={staff.name} />
                  <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{staff.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{staff.role}</p>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full flex items-center gap-2" onClick={() => handleChatOpen(staff)}>
                  <MessageCircle className="w-4 h-4" /> Chat
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Chat Modal */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-md flex flex-col">
          <DialogHeader>
            <DialogTitle>Chat with {selectedStaff?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto max-h-60 border rounded-lg p-3 mb-3 bg-gray-50">
            {selectedStaff ? (
              (chatHistory[selectedStaff.id] || []).map((msg, idx) => (
                <div key={idx} className={`mb-2 ${msg.from === "You" ? "text-right" : "text-left"}`}>
                  <span
                    className={`inline-block px-3 py-1 rounded-xl ${
                      msg.from === "You" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No messages yet</p>
            )}
            {isTyping && (
              <div className="text-right mb-2">
                <span className="inline-block px-3 py-1 rounded-xl bg-blue-500 text-white">
                  <span className="animate-pulse">|</span>
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-md flex flex-col gap-3">
          <DialogHeader>
            <DialogTitle>Book Appointment with {bookingStaff?.name}</DialogTitle>
          </DialogHeader>
          <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
          <Input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} />
          <Input
            type="text"
            placeholder="Reason for appointment"
            value={bookingReason}
            onChange={(e) => setBookingReason(e.target.value)}
          />
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
