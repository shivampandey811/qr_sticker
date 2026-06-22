"use client"
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, ShoppingBag, Trash2, Plus, Minus, X, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react'
import Logo from '../components/Logo'

const shopStickers = [
  {
    id: 'holo',
    name: 'Hyper-Gloss Holographic',
    category: 'Iridescent Series',
    desc: 'Light-refractive holographic layers built on top of a carbon-fiber backplate.',
    price: 299,
    image: '/sticker_holographic.png',
    rating: '4.9 (120 reviews)',
    badge: 'Best Seller'
  },
  {
    id: 'cyber',
    name: 'Stealth Cyberpunk Matte',
    category: 'Cyberpunk Series',
    desc: 'Deep matte black base infused with neon-blue circuit paths for tinted windows.',
    price: 349,
    image: '/sticker_cyberpunk.png',
    rating: '4.8 (85 reviews)',
    badge: 'Popular'
  },
  {
    id: 'amber',
    name: 'Emergency Amber Glow',
    category: 'High-Visibility',
    desc: 'High-contrast safety amber with quick-scan frames. Best for rescue/warning alerts.',
    price: 220,
    image: '/sticker_amber_glow.png',
    rating: '4.7 (64 reviews)',
    badge: 'Essential'
  },
  {
    id: 'carbon',
    name: 'Carbon Fiber Edition',
    category: 'Tactical Series',
    desc: 'Genuine carbon fiber woven design, bulletproof durability, matte texture.',
    price: 450,
    image: '/sticker_holographic.png', // Reuse holographic for clean mockup
    rating: '4.9 (53 reviews)',
    badge: 'Premium'
  },
  {
    id: 'titanium',
    name: 'Brushed Titanium smart-tag',
    category: 'Metal Series',
    desc: 'Brushed titanium metallic surface sticker for a heavy-duty industrial look.',
    price: 520,
    image: '/sticker_cyberpunk.png', // Reuse cyberpunk
    rating: '4.8 (44 reviews)',
    badge: 'Heavy Duty'
  },
  {
    id: 'violet',
    name: 'Neon Violet Aura',
    category: 'Cyberpunk Series',
    desc: 'Vibrant neon purple/violet glowing border framing a modern code system.',
    price: 399,
    image: '/sticker_cyberpunk.png',
    rating: '4.6 (39 reviews)',
    badge: 'Trending'
  },
  {
    id: 'ceramic',
    name: 'Premium Matte White',
    category: 'Classic Series',
    desc: 'Sleek ceramic-like matte white sticker with minimalist black coordinates.',
    price: 280,
    image: '/sticker_holographic.png',
    rating: '4.5 (78 reviews)',
    badge: 'Minimalist'
  },
  {
    id: 'gold',
    name: 'Gold Leaf Deluxe',
    category: 'Luxury Series',
    desc: 'Delicate metallic gold-leaf details overlaid on weather-sealed glass backing.',
    price: 799,
    image: '/sticker_amber_glow.png',
    rating: '5.0 (22 reviews)',
    badge: 'Limited Edition'
  },
  {
    id: 'camo',
    name: 'Tactical Camo Matte',
    category: 'Tactical Series',
    desc: 'Dark forest green camouflage pattern designed for off-roaders and overland rigs.',
    price: 250,
    image: '/sticker_holographic.png',
    rating: '4.7 (19 reviews)',
    badge: 'Outdoor'
  },
  {
    id: 'retro',
    name: 'Reflective Cyber Grid',
    category: 'Reflective Series',
    desc: 'High-power retroreflective grid layout ensuring maximum readability at night.',
    price: 599,
    image: '/sticker_cyberpunk.png',
    rating: '4.9 (31 reviews)',
    badge: 'Retro'
  }
]

export default function Shop() {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prevCart, { ...product, qty: 1 }]
    })
    setIsCartOpen(true)
  }

  const updateQty = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + amount
            return nextQty > 0 ? { ...item, qty: nextQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0)
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0)

  const handleCheckout = () => {
    setCheckoutSuccess(true)
    setCart([])
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-100/30 via-indigo-50/20 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 futuristic-grid opacity-25 pointer-events-none z-0" />

      {/* Header */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8 border-b border-slate-100 bg-white/60 backdrop-blur-md">
        <Logo />
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-cyan-600 transition">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-sm"
          >
            <ShoppingCart size={20} className="text-slate-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-cyan-500 text-[10px] font-black text-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Shop Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Secure Checkout & Delivery</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Get Your CarPing Smart Sticker
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Browse our weather-sealed smart stickers. Each sticker includes lifetime mapping to your private dashboard. No ongoing subscription fees.
          </p>
        </div>

        {/* Sticker Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shopStickers.map((sticker) => (
            <div key={sticker.id} className="glass-panel rounded-3xl p-5 border border-slate-100 flex flex-col justify-between group hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/[0.02] transition-all duration-300">
              <div>
                {/* Image Container */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-100 flex items-center justify-center p-2 mb-5">
                  <img 
                    src={sticker.image} 
                    alt={sticker.name} 
                    className="w-full h-full object-cover rounded-xl transition duration-500 group-hover:scale-105" 
                  />
                  {sticker.badge && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-cyan-600 px-2.5 py-1 rounded-lg border border-slate-100">
                      {sticker.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-xs font-black text-white px-2.5 py-1 rounded-lg">
                    ₹{sticker.price}
                  </span>
                </div>

                {/* Info */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{sticker.category}</span>
                <h3 className="mt-1 font-display text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  {sticker.name}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed min-h-[48px]">
                  {sticker.desc}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">Rating: {sticker.rating}</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => addToCart(sticker)}
                className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 group-hover:scale-[1.02]"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-100">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-cyan-600" />
                  <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
                  <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body (Items List) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingCart className="text-slate-300 mb-4" size={48} />
                    <p className="font-bold text-slate-800">Your cart is empty</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Explore our sticker catalog and add standard or custom designs.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div className="w-16 h-16 rounded-xl bg-slate-950 overflow-hidden border border-slate-100 shrink-0 flex items-center justify-center p-1">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-900 text-xs md:text-sm">{item.name}</h4>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-500 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{item.category}</span>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-0.5">
                            <button 
                              onClick={() => updateQty(item.id, -1)}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-bold px-1.5">{item.qty}</span>
                            <button 
                              onClick={() => updateQty(item.id, 1)}
                              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-800">
                            ₹{item.price * item.qty}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-slate-600">Subtotal</span>
                    <span className="font-mono text-lg font-black text-slate-900">₹{cartTotal}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-6 leading-relaxed">
                    Standard shipping (2-4 business days) is included. Custom branding may take an additional 2 days.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={clearCart}
                      className="py-3.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold transition text-slate-700"
                    >
                      Clear All
                    </button>
                    <button 
                      onClick={handleCheckout}
                      className="btn-gold py-3.5 rounded-xl text-xs font-bold"
                    >
                      Checkout Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Success Popup */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 backdrop-blur-md p-6">
          <div className="glass-panel max-w-md w-full rounded-3xl p-8 border border-cyan-500/20 relative shadow-2xl bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center mx-auto mb-6 border border-cyan-100">
              <Check size={28} />
            </div>

            <h3 className="font-display text-xl font-bold text-slate-900">Order Completed Successfully!</h3>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Your CarPing smart activation kit has been scheduled. Your shipping tracker and login activation link have been sent to your email.
            </p>

            <button 
              onClick={() => setCheckoutSuccess(false)}
              className="btn-primary mt-8 w-full py-3.5 text-center font-bold"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-100 bg-[#f9fafb] px-6 py-8 text-slate-600 text-center">
        <p className="text-xs">
          &copy; 2026 CarPing. Secure vehicle communications platform. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
