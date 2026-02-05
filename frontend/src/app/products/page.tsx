'use client'

import { useState, useEffect } from 'react'
import axios from '../../lib/axios'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import {
  Grid,
  List,
  ShoppingCart,
  Heart,
  Star,
  SlidersHorizontal,
} from 'lucide-react'

import { motion } from 'framer-motion'

/* ---------------- TYPES ---------------- */

interface Product {
  id: string
  name: string
  slug: string
  shortdescription: string
  price: number
  compareprice?: number
  images: string
  inventory: number
  category_name: string
  averagerating: number
  reviewcount: number
}

/* ---------------- COMPONENT ---------------- */

export default function ProductsPage() {

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)


  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory, sortBy])


  const fetchProducts = async () => {
    try {
      setLoading(true)

      const res = await axios.get('/products', {
        params: {
          search: searchTerm,
          category: selectedCategory,
          sortBy,
          order: 'desc',
        },
      })

      setProducts(res.data.products || [])

    } catch (err) {
      console.error('Product Fetch Error:', err)
    } finally {
      setLoading(false)
    }
  }


  /* ---------------- HELPERS ---------------- */

  const getImageUrl = (images: string) => {
    try {
      const arr = JSON.parse(images || '[]')
      return arr[0] || '/placeholder-product.jpg'
    } catch {
      return '/placeholder-product.jpg'
    }
  }


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price)
  }


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }


  /* ---------------- ACTIONS ---------------- */

  const addToWishlist = async (id: string) => {
    try {
      await axios.post('/wishlist', { productId: id })
    } catch (err) {
      console.error(err)
    }
  }


  const addToCart = async (id: string) => {
    try {
      await axios.post('/cart', {
        productId: id,
        quantity: 1,
      })
    } catch (err) {
      console.error(err)
    }
  }


/* ---------------- UI ---------------- */

return (
<div className="min-h-screen flex flex-col">

<Header />

<main className="flex-1 bg-gray-50">

{/* Header */}
<div className="bg-white border-b">
<div className="container mx-auto px-4 py-6">

<h1 className="text-3xl font-bold">Our Products</h1>

<p className="text-gray-600 mt-1">
Discover our premium Ayurvedic products
</p>

</div>
</div>


<div className="container mx-auto px-4 py-8">

{/* View Switch */}
<div className="flex justify-end gap-2 mb-6">

<Button
variant={viewMode === 'grid' ? 'default' : 'ghost'}
size="sm"
onClick={() => setViewMode('grid')}
>
<Grid size={16} />
</Button>

<Button
variant={viewMode === 'list' ? 'default' : 'ghost'}
size="sm"
onClick={() => setViewMode('list')}
>
<List size={16} />
</Button>

</div>


{/* Products */}

{loading ? (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{[...Array(6)].map((_, i) => (

<Card key={i} className="animate-pulse">
<div className="h-48 bg-gray-200" />
</Card>

))}

</div>

) : (

<div
className={
viewMode === 'grid'
? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
: 'space-y-4'
}
>


{products.map((product) => (

<motion.div
key={product.id}
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
>

<Card className="hover:shadow-lg transition">

<CardContent className="p-4">

{/* Image */}
<div className="h-48 mb-3 overflow-hidden rounded">

<img
src={getImageUrl(product.images)}
className="w-full h-full object-cover"
/>

</div>


{/* Info */}

<Badge>{product.category_name}</Badge>

<h3 className="font-semibold mt-2">
{product.name}
</h3>

<p className="text-sm text-gray-600">
{product.shortdescription}
</p>


{/* Price */}

<div className="mt-2 font-bold text-emerald-600">
{formatPrice(product.price)}
</div>


{/* Rating */}

<div className="flex gap-1 mt-1">
{renderStars(product.averagerating)}
</div>


{/* Actions */}

<div className="flex justify-between mt-4">

<Button
size="sm"
variant="ghost"
onClick={() => addToWishlist(product.id)}
>
<Heart size={16} />
</Button>


<Button
size="sm"
className="bg-emerald-600"
onClick={() => addToCart(product.id)}
>
<ShoppingCart size={16} className="mr-1" />
Add
</Button>

</div>

</CardContent>

</Card>

</motion.div>

))}

</div>

)}

</div>

</main>

<Footer />

</div>
)
}
