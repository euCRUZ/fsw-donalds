"use client"

import { Product } from "@prisma/client"
import { Pick } from "@prisma/client/runtime/library"
import { createContext, ReactNode, useState } from "react"

export interface CartProduct
  extends Pick<Product, "id" | "name" | "price" | "imageUrl"> {
  quantity: number
}

export interface ICartContext {
  isOpen: boolean
  products: CartProduct[]
  toggleCart: () => void
  addProduct: (product: CartProduct) => void
  decreaseProductQuantity: (productId: string) => void
}

export const CartContext = createContext<ICartContext>({
  isOpen: false,
  products: [],
  toggleCart: () => {},
  addProduct: () => {},
  decreaseProductQuantity: () => {},
})

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleCart = () => {
    setIsOpen((prev) => !prev)
  }

  const addProduct = (product: CartProduct) => {
    const existingProduct = products.some(
      (products) => products.id === product.id,
    )
    if (!existingProduct) {
      return setProducts((prev) => [...prev, product])
    }

    // If the product already exists in the cart, we should update the quantity of the product instead of adding a new one to the cart.
    setProducts((prev) => {
      return prev.map((prevProduct) => {
        if (prevProduct.id === product.id) {
          return {
            ...prevProduct,
            quantity: prevProduct.quantity + product.quantity,
          }
        }
        return prevProduct
      })
    })
  }

  const decreaseProductQuantity = (productId: string) => {
    setProducts((prev) => {
      return prev.map((product) => {
        if (product.id !== productId) {
          return product
        }

        if (product.quantity === 1) {
          return product
        }

        return {
          ...product,
          quantity: product.quantity - 1,
        }
      })
    })
  }

  return (
    <CartContext.Provider
      value={{
        isOpen,
        products,
        toggleCart,
        addProduct,
        decreaseProductQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
