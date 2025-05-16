"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart: cart.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          issue_number: item.issue_number,
          quantity: item.quantity,
        })),
      }),
    });
    const json = await res.json();
    if (json.url) {
      router.push(json.url);
    } else {
      alert(json.error || "Failed to start checkout.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-12">
      <div className="container mx-auto max-w-3xl bg-black/80 rounded-2xl shadow-2xl p-8 border border-red-900/40">
        <h1 className="text-3xl md:text-4xl font-bold text-red-500 mb-8 text-center">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-6">Your cart is empty.</p>
            <Link href="/shop" className="rounded-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-md border border-red-900/40 hover:border-red-400 transition-colors">
              Browse Magazines
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-800 mb-8">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center py-6 gap-6">
                  <div className="w-24 h-32 bg-gray-900 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-lg font-bold text-white line-clamp-1">{item.title}</h2>
                      <button
                        className="text-xs text-red-400 hover:text-red-200 font-bold px-2 py-1 rounded transition-colors"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-gray-400 text-sm mb-1">Issue #{item.issue_number}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-300">Qty:</span>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-14 px-2 py-1 rounded border border-gray-700 bg-gray-800 text-white text-center focus:outline-none focus:border-red-400"
                        style={{ MozAppearance: 'textfield' }}
                      />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-red-400">${(item.price * item.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mb-8">
              <button
                className="text-sm text-gray-400 hover:text-red-400 underline"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <div className="text-2xl font-bold text-white">Total: <span className="text-red-400">${total.toFixed(2)}</span></div>
            </div>
            <button
              className="w-full rounded-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-md border border-red-900/40 hover:border-red-400 transition-colors text-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Checkout
            </button>
            <Link href="/shop" className="block text-center text-gray-300 hover:text-red-400 mt-2 underline">
              Continue Shopping
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
