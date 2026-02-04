'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Upload,
  Save,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  inventory: number
  status: string
  category: string
  sales: number
  revenue: number
  createdAt: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    inventory: '',
    category: '',
    description: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn')
    if (!isAdminLoggedIn) {
      router.push('/admin/auth')
      return
    }

    // Load products
    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      // Simulate API call
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Almonds',
          slug: 'premium-almonds',
          price: 299,
          inventory: 45,
          status: 'ACTIVE',
          category: 'Dry Fruits',
          sales: 234,
          revenue: 69966,
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'Ashwagandha Powder',
          slug: 'ashwagandha-powder',
          price: 199,
          inventory: 12,
          status: 'ACTIVE',
          category: 'Ayurvedic Herbs',
          sales: 189,
          revenue: 37611,
          createdAt: '2024-01-02'
        },
        {
          id: '3',
          name: 'Organic Tofu',
          slug: 'organic-tofu-extra-firm',
          price: 89,
          inventory: 8,
          status: 'ACTIVE',
          category: 'Tofu Products',
          sales: 156,
          revenue: 13884,
          createdAt: '2024-01-03'
        },
        {
          id: '4',
          name: 'Turmeric Powder',
          slug: 'turmeric-powder',
          price: 149,
          inventory: 3,
          status: 'LOW_STOCK',
          category: 'Ayurvedic Herbs',
          sales: 145,
          revenue: 21605,
          createdAt: '2024-01-04'
        },
        {
          id: '5',
          name: 'Cashew Nuts',
          slug: 'cashew-nuts',
          price: 249,
          inventory: 0,
          status: 'OUT_OF_STOCK',
          category: 'Dry Fruits',
          sales: 98,
          revenue: 24402,
          createdAt: '2024-01-05'
        }
      ]
      
      setProducts(sampleProducts)
      setLoading(false)
    } catch (error) {
      console.error('Error loading products:', error)
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      inventory: product.inventory.toString(),
      category: product.category,
      description: '',
      status: product.status
    })
    setIsEditing(true)
  }

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Simulate API call
        setProducts(prev => prev.filter(p => p.id !== productId))
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const handleSave = async () => {
    try {
      // Simulate API call
      if (isEditing && selectedProduct) {
        // Update existing product
        setProducts(prev => prev.map(p => 
          p.id === selectedProduct.id 
            ? { ...p, ...formData, price: parseFloat(formData.price), inventory: parseInt(formData.inventory) }
            : p
        ))
      } else {
        // Add new product
        const newProduct: Product = {
          id: Date.now().toString(),
          ...formData,
          price: parseFloat(formData.price),
          inventory: parseInt(formData.inventory),
          sales: 0,
          revenue: 0,
          createdAt: new Date().toISOString()
        }
        setProducts(prev => [...prev, newProduct])
      }
      
      setIsEditing(false)
      setSelectedProduct(null)
      setShowAddModal(false)
      setFormData({
        name: '',
        slug: '',
        price: '',
        inventory: '',
        category: '',
        description: '',
        status: 'ACTIVE'
      })
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-gray-100 text-gray-800'
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800'
      case 'LOW_STOCK': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockColor = (inventory: number) => {
    if (inventory === 0) return 'text-red-600'
    if (inventory < 10) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Admin Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/dashboard">
                    ← Back to Dashboard
                  </Link>
                </Button>
                <h1 className="text-xl font-bold text-gray-900">Product Management</h1>
              </div>
              
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-900">Product</th>
                      <th className="text-left p-4 font-medium text-gray-900">Category</th>
                      <th className="text-left p-4 font-medium text-gray-900">Price</th>
                      <th className="text-left p-4 font-medium text-gray-900">Stock</th>
                      <th className="text-left p-4 font-medium text-gray-900">Sales</th>
                      <th className="text-left p-4 font-medium text-gray-900">Revenue</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.slug}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{product.category}</Badge>
                        </td>
                        <td className="p-4 font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="p-4">
                          <span className={`font-medium ${getStockColor(product.inventory)}`}>
                            {product.inventory}
                          </span>
                        </td>
                        <td className="p-4 text-gray-900">{product.sales}</td>
                        <td className="p-4 font-medium text-gray-900">
                          {formatPrice(product.revenue)}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(product.status)}>
                            {product.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={`/product/${product.slug}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      {(showAddModal || isEditing) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false)
                    setIsEditing(false)
                    setSelectedProduct(null)
                    setFormData({
                      name: '',
                      slug: '',
                      price: '',
                      inventory: '',
                      category: '',
                      description: '',
                      status: 'ACTIVE'
                    })
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="product-slug"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inventory
                    </label>
                    <Input
                      type="number"
                      value={formData.inventory}
                      onChange={(e) => setFormData({...formData, inventory: e.target.value})}
                      placeholder="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Dry Fruits">Dry Fruits</option>
                      <option value="Ayurvedic Herbs">Ayurvedic Herbs</option>
                      <option value="Dehydrated Foods">Dehydrated Foods</option>
                      <option value="Tofu Products">Tofu Products</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="OUT_OF_STOCK">Out of Stock</option>
                      <option value="LOW_STOCK">Low Stock</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false)
                      setIsEditing(false)
                      setSelectedProduct(null)
                      setFormData({
                        name: '',
                        slug: '',
                        price: '',
                        inventory: '',
                        category: '',
                        description: '',
                        status: 'ACTIVE'
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}