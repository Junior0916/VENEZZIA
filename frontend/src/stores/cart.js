import { defineStore } from 'pinia'

const STORAGE_KEY = 'onepage_cart_items'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
    isOpen: false
  }),

  getters: {
    totalCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    totalAmount: (state) => {
      return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    },
    formattedTotal: (state) => {
      const sum = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      return `S/ ${sum.toFixed(2)}`
    }
  },

  actions: {
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },

    addToCart(product, quantity = 1) {
      const itemKey = product.addon ? `${product.id}__${product.addon}` : product.id
      const existing = this.items.find(item => (item.id || item.product.id) === itemKey)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({
          id: itemKey,
          product,
          quantity
        })
      }
      this.saveToStorage()
      this.isOpen = true
    },

    updateQuantity(itemKey, quantity) {
      if (quantity <= 0) {
        this.removeFromCart(itemKey)
        return
      }
      const item = this.items.find(item => (item.id || item.product.id) === itemKey)
      if (item) {
        item.quantity = quantity
        this.saveToStorage()
      }
    },

    removeFromCart(itemKey) {
      this.items = this.items.filter(item => (item.id || item.product.id) !== itemKey)
      this.saveToStorage()
    },

    clearCart() {
      this.items = []
      this.saveToStorage()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    openCart() {
      this.isOpen = true
    },

    closeCart() {
      this.isOpen = false
    }
  }
})
