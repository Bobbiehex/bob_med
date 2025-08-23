"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const drugs = [
  { id: 1, name: "Paracetamol", price: 500, image: "/drugs/paracetamol.jpg" },
  { id: 2, name: "Ibuprofen", price: 700, image: "/drugs/ibuprofen.jpg" },
  { id: 3, name: "Amoxicillin", price: 1200, image: "/drugs/amoxicillin.jpg" },
  { id: 4, name: "Ciprofloxacin", price: 1500, image: "/drugs/ciprofloxacin.jpg" },
  { id: 5, name: "Metformin", price: 1000, image: "/drugs/metformin.jpg" },
  { id: 6, name: "Atorvastatin", price: 2000, image: "/drugs/atorvastatin.jpg" },
  { id: 7, name: "Omeprazole", price: 800, image: "/drugs/omeprazole.jpg" },
  { id: 8, name: "Losartan", price: 900, image: "/drugs/losartan.jpg" },
  { id: 9, name: "Amlodipine", price: 950, image: "/drugs/amlodipine.jpg" },
  { id: 10, name: "Vitamin C", price: 300, image: "/drugs/vitamin_c.jpg" },
  { id: 11, name: "Insulin", price: 2500, image: "/drugs/insulin.jpg" },
  { id: 12, name: "Hydrochlorothiazide", price: 850, image: "/drugs/hydrochlorothiazide.jpg" },
  { id: 13, name: "Lisinopril", price: 950, image: "/drugs/lisinopril.jpg" },
  { id: 14, name: "Azithromycin", price: 1800, image: "/drugs/azithromycin.jpg" },
  { id: 15, name: "Clopidogrel", price: 1900, image: "/drugs/clopidogrel.jpg" },
  { id: 16, name: "Prednisone", price: 1100, image: "/drugs/prednisone.jpg" },
  { id: 17, name: "Sertraline", price: 2000, image: "/drugs/sertraline.jpg" },
  { id: 18, name: "Fluoxetine", price: 1800, image: "/drugs/fluoxetine.jpg" },
  { id: 19, name: "Aspirin", price: 400, image: "/drugs/aspirin.jpg" },
  { id: 20, name: "Warfarin", price: 2100, image: "/drugs/warfarin.jpg" },

  // ... continue for all your drugs
]

export default function PharmacyPage() {
  const [cart, setCart] = useState<{ [key: number]: { qty: number; price: number } }>({})
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    const savedCart = localStorage.getItem("pharmacy_cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("pharmacy_cart", JSON.stringify(cart))
  }, [cart])

  const handleAddToCart = (id: number, price: number) => {
    const qty = quantities[id] || 1
    setCart(prev => ({
      ...prev,
      [id]: { qty: (prev[id]?.qty || 0) + qty, price }
    }))
    setQuantities(prev => ({ ...prev, [id]: 1 })) // reset after adding
  }

  const changeQuantity = (id: number, amount: number) => {
    setQuantities(prev => {
      const newQty = Math.max(1, (prev[id] || 1) + amount)
      return { ...prev, [id]: newQty }
    })
  }

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.qty, 0)

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      {/* Top bar with title + cart link */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pharmacy</h1>
        <Link href="/dashboard/cart" className="relative">
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Drug list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {drugs.map(drug => (
          <Card key={drug.id}>
            <CardContent className="p-4 flex flex-col items-center">
              <Image
                src={drug.image}
                alt={drug.name}
                width={120}
                height={120}
                className="rounded-md object-cover mb-2"
              />
              <h3 className="font-semibold">{drug.name}</h3>
              <p className="text-muted-foreground mb-2">₦{drug.price}</p>

              {/* Quantity selector */}
              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeQuantity(drug.id, -1)}
                >
                  -
                </Button>
                <span>{quantities[drug.id] || 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeQuantity(drug.id, 1)}
                >
                  +
                </Button>
              </div>

              {/* Add to cart button */}
              <Button onClick={() => handleAddToCart(drug.id, drug.price)}>
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
