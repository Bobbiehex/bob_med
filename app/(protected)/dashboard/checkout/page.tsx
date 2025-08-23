"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Same drugs list (make sure IDs & prices match)
const drugs = [
  { id: 1, name: "Paracetamol", price: 500, image: "/drugs/paracetamol.jpg" },
  { id: 2, name: "Ibuprofen", price: 700, image: "/drugs/ibuprofen.jpg" },
  { id: 3, name: "Amoxicillin", price: 1200, image: "/drugs/amoxicillin.jpg" },
  { id: 4, name: "Ciprofloxacin", price: 1500, image: "/drugs/ciprofloxacin.jpg" },
  { id: 5, name: "Vitamin C", price: 400, image: "/drugs/vitamin_c.jpg" },
  // ... continue for your 50 drugs
]

export default function CheckoutPage() {
  const [cart, setCart] = useState<{ [key: number]: { qty: number; price: number } }>({})
  const [form, setForm] = useState({ name: "", email: "", address: "", phone: "" })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const router = useRouter()

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("pharmacy_cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const cartItems = Object.keys(cart)
    .map(id => {
      const drug = drugs.find(d => d.id === Number(id))
      if (!drug) return null
      return { ...drug, qty: cart[Number(id)].qty }
    })
    .filter(Boolean)

  const totalPrice = Object.values(cart).reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    // For now: just clear cart + show success
    localStorage.removeItem("pharmacy_cart")
    setCart({})
    setOrderPlaced(true)

    setTimeout(() => {
      router.push("/dashboard/pharmacy") // Redirect back to shop after success
    }, 3000)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <Card className="p-8 shadow-md">
          <h1 className="text-2xl font-bold mb-4">✅ Order Placed Successfully!</h1>
          <p className="text-muted-foreground">You’ll be redirected back to the pharmacy page shortly...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="grid gap-4">
            {cartItems.map(item => (
              <Card key={item!.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Image
                    src={item!.image}
                    alt={item!.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item!.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item!.qty} × ₦{item!.price}
                    </p>
                  </div>
                  <p className="font-semibold">₦{item!.qty * item!.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>₦{totalPrice}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Customer Details</h2>
          <form onSubmit={handleCheckout} className="grid gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="mt-2">
              Place Order
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
