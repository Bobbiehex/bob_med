"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Same drugs list as before
const drugs = [
  { id: 1, name: "Paracetamol", price: 500, image: "/drugs/paracetamol.jpg" },
  { id: 2, name: "Ibuprofen", price: 700, image: "/drugs/ibuprofen.jpg" },
  { id: 3, name: "Amoxicillin", price: 1200, image: "/drugs/amoxicillin.jpg" },
  { id: 4, name: "Ciprofloxacin", price: 1500, image: "/drugs/ciprofloxacin.jpg" },
  { id: 5, name: "Vitamin C", price: 400, image: "/drugs/vitamin_c.jpg" },
  // ...continue
]

export default function CartPage() {
  const [cart, setCart] = useState<{ [key: number]: { qty: number; price: number } }>({})
  const router = useRouter()

  useEffect(() => {
    const savedCart = localStorage.getItem("pharmacy_cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const updateCart = (id: number, newQty: number) => {
    const updated = { ...cart }
    if (newQty <= 0) {
      delete updated[id]
    } else {
      updated[id] = { qty: newQty, price: drugs.find(d => d.id === id)!.price }
    }
    setCart(updated)
    localStorage.setItem("pharmacy_cart", JSON.stringify(updated))
  }

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

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
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
                    <p className="text-sm text-muted-foreground">₦{item!.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCart(item!.id, item!.qty - 1)}
                      >
                        -
                      </Button>
                      <span>{item!.qty}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCart(item!.id, item!.qty + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <p className="font-semibold">₦{item!.qty * item!.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total + Checkout */}
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Total: ₦{totalPrice}</h2>
            <Button onClick={() => router.push("/dashboard/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
