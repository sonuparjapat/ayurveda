'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import toast from 'react-hot-toast'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Eye,
  Trash2,
  Search,
  Loader2,
  Pencil,
} from 'lucide-react'


export default function AdminProducts() {

  /* ---------------- STATES ---------------- */

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
const [editItem, setEditItem] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  const [viewItem, setViewItem] = useState<any>(null)
const [editImages, setEditImages] = useState<File[]>([])
  const [form, setForm] = useState<any>({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    images: [],
  })


  const limit = 8


  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    loadProducts()
  }, [page, search])

const openEdit = (product: any) => {

  setEditItem({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.inventory,
    category: product.category_name,
    images:product?.images
  })

}
  const loadProducts = async () => {

    try {

      setLoading(true)

      const res = await axios.get(
        `/admin/products?page=${page}&limit=${limit}&search=${search}`,
        {
          withCredentials: true, // ✅ USE COOKIES
        }
      )

      setProducts(res.data.products)
      setTotal(res.data.total)

    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

const updateProduct = async () => {

  try {

    setSubmitting(true)

    const data = new FormData()

    data.append('name', editItem.name)
    data.append('description', editItem.description)
    data.append('price', editItem.price)
    data.append('stock', editItem.stock)
    data.append('category', editItem.category)

    // send old images for delete
    data.append('oldImages', editItem.images || '[]')


    // new images
    editImages.forEach(file => {
      data.append('images', file)
    })


    await axios.put(
      `/admin/products/${editItem.id}`,
      data,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )


    toast.success('Updated successfully')

    setEditItem(null)
    setEditImages([])

    loadProducts()

  } catch {

    toast.error('Update failed')

  } finally {

    setSubmitting(false)

  }

}
  /* ---------------- CREATE ---------------- */

  const handleSubmit = async () => {

    try {

      setSubmitting(true)

      const data = new FormData()

      Object.keys(form).forEach(key => {

        if (key === 'images') {

          form.images.forEach((f: any) => {
            data.append('images', f)
          })

        } else {
          data.append(key, form[key])
        }

      })


      await axios.post('/admin/products', data, {
        withCredentials: true, // ✅ COOKIE AUTH
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })


      toast.success('Product added')

      setForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        images: [],
      })

      loadProducts()

    } catch {
      toast.error('Create failed')
    } finally {
      setSubmitting(false)
    }
  }


  /* ---------------- DELETE ---------------- */

  const deleteProduct = async (id: string) => {

    if (!confirm('Delete product?')) return

    try {

      await axios.delete(`/admin/products/${id}`, {
        withCredentials: true, // ✅ COOKIE AUTH
      })

      toast.success('Deleted')

      loadProducts()

    } catch {
      toast.error('Delete failed')
    }
  }


/* ---------------- UI ---------------- */

return (
<div className="space-y-6">


{/* HEADER */}

<div className="flex flex-col sm:flex-row gap-3 justify-between">

<h1 className="text-xl sm:text-2xl font-bold">
Product Management
</h1>


<div className="flex gap-2 w-full sm:w-auto">

<div className="relative w-full sm:w-64">

<Search
size={16}
className="absolute left-2 top-2.5 text-gray-400"
/>

<Input
className="pl-7"
placeholder="Search..."
value={search}
onChange={e => {
  setSearch(e.target.value)
  setPage(1)
}}
/>

</div>

</div>

</div>


{/* ADD PRODUCT */}

<Card>

<CardHeader>
<CardTitle>Add Product</CardTitle>
</CardHeader>

<CardContent className="grid md:grid-cols-2 gap-3">


<Input
placeholder="Name"
value={form.name}
onChange={e => setForm({...form,name:e.target.value})}
/>

<Input
placeholder="Category"
value={form.category}
onChange={e => setForm({...form,category:e.target.value})}
/>

<Input
type="number"
placeholder="Price"
value={form.price}
onChange={e => setForm({...form,price:e.target.value})}
/>

<Input
type="number"
placeholder="Stock"
value={form.stock}
onChange={e => setForm({...form,stock:e.target.value})}
/>

<Input
placeholder="Description"
value={form.description}
onChange={e => setForm({...form,description:e.target.value})}
/>


<input
type="file"
multiple
className="text-sm border rounded p-2"
onChange={e =>
  setForm({
    ...form,
    images: Array.from(e.target.files || []),
  })
}
/>


<Button
className="bg-emerald-600 md:col-span-2"
onClick={handleSubmit}
disabled={submitting}
>

{submitting && (
  <Loader2 size={16} className="mr-1 animate-spin" />
)}

Add Product

</Button>

</CardContent>

</Card>


{/* PRODUCT LIST */}

<Card>

<CardHeader>
<CardTitle>All Products</CardTitle>
</CardHeader>

<CardContent className="p-0">


{loading ? (

<div className="py-10 text-center">
<Loader2 className="mx-auto animate-spin" />
</div>

) : (

<div className="overflow-x-auto">


<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left">Name</th>
<th className="p-3 hidden sm:table-cell">Category</th>
<th className="p-3">Price</th>
<th className="p-3 hidden md:table-cell">Stock</th>
<th className="p-3 text-center">Action</th>

</tr>

</thead>


<tbody>


{products.map(p => (

<tr
key={p.id}
className="border-b hover:bg-gray-50"
>


<td className="p-3 font-medium">
{p.name}
</td>


<td className="p-3 hidden sm:table-cell">
{p.category_name}
</td>


<td className="p-3">
₹{p.price}
</td>


<td className="p-3 hidden md:table-cell">
{p.inventory}
</td>


<td className="p-3 text-center">

<div className="flex justify-center gap-2">

  {/* VIEW */}
  <Button
    size="sm"
    variant="outline"
    onClick={() => setViewItem(p)}
  >
    <Eye size={14} />
  </Button>

  {/* EDIT */}
  <Button
    size="sm"
    variant="secondary"
    onClick={() => openEdit(p)}
  >
    <Pencil size={14} />
  </Button>

  {/* DELETE */}
  <Button
    size="sm"
    variant="destructive"
    onClick={() => deleteProduct(p.id)}
  >
    <Trash2 size={14} />
  </Button>

</div>

</td>

</tr>

))}


</tbody>

</table>

</div>

)}

</CardContent>

</Card>


{/* PAGINATION */}

<div className="flex justify-center flex-wrap gap-2">

{Array.from({
  length: Math.ceil(total / limit),
}).map((_, i) => (

<Button
key={i}
size="sm"
variant={page === i+1 ? 'default' : 'outline'}
onClick={() => setPage(i+1)}
>
{i+1}
</Button>

))}

</div>


{/* VIEW MODAL */}

{viewItem && (

<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3">

<div className="bg-white w-full max-w-md rounded-lg p-5 space-y-3 max-h-[90vh] overflow-auto">

<h2 className="font-bold text-lg">
{viewItem.name}
</h2>

<p className="text-sm">
{viewItem.description}
</p>

<p>₹{viewItem.price}</p>
<p>Stock: {viewItem.inventory}</p>


<div className="flex gap-2 overflow-x-auto">

{(viewItem?.images || '[]')?.map((img:any,i:number)=>(

<img
key={i}
src={img}
alt=""
className="w-20 h-20 object-cover rounded"
/>

))}

</div>


<Button
className="w-full"
onClick={() => setViewItem(null)}
>
Close
</Button>

</div>

</div>

)}
{editItem && (

<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3">

<div className="bg-white w-full max-w-md rounded-lg p-5 space-y-3">


<h2 className="font-bold text-lg">
Edit Product
</h2>


<Input
placeholder="Name"
value={editItem.name}
onChange={e =>
  setEditItem({
    ...editItem,
    name: e.target.value,
  })
}
/>


<Input
placeholder="Category"
value={editItem.category}
onChange={e =>
  setEditItem({
    ...editItem,
    category: e.target.value,
  })
}
/>


<Input
type="number"
placeholder="Price"
value={editItem.price}
onChange={e =>
  setEditItem({
    ...editItem,
    price: e.target.value,
  })
}
/>


<Input
type="number"
placeholder="Stock"
value={editItem.stock}
onChange={e =>
  setEditItem({
    ...editItem,
    stock: e.target.value,
  })
}
/>


<Input
placeholder="Description"
value={editItem.description}
onChange={e =>
  setEditItem({
    ...editItem,
    description: e.target.value,
  })
}
/>
{/* OLD IMAGES */}

<div className="flex gap-2 overflow-x-auto">

{(editItem?.images || '[]')?.map((img:any,i:number)=>(

  <img
    key={i}
    src={img}
    className="w-16 h-16 rounded object-cover"
  />

))}

</div>
<input
  type="file"
  multiple
  className="text-sm border rounded p-2"
  onChange={e =>
    setEditImages(Array.from(e.target.files || []))
  }
/>

<div className="flex gap-2 pt-2">

<Button
className="flex-1"
variant="outline"
onClick={() => setEditItem(null)}
>
Cancel
</Button>


<Button
className="flex-1 bg-emerald-600"
onClick={updateProduct}
disabled={submitting}
>

{submitting && (
  <Loader2 size={16} className="mr-1 animate-spin" />
)}

Update

</Button>

</div>


</div>

</div>

)}

</div>
)
}