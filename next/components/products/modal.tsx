"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatNumber } from "@/lib/utils";
import { IconTrash } from "@tabler/icons-react";
import { strapiImage } from "@/lib/strapi/strapiImage";

export default function AddToCartModal({ onClick }: { onClick: () => void }) {
  const { items, updateQuantity, getCartTotal, removeFromCart } = useCart();
  return (
    <Modal>
      <ModalTrigger onClick={onClick} className="mt-10 w-full">
        Add to cart
      </ModalTrigger>
      <ModalBody>
        <ModalContent>
          <h4 className="text-lg md:text-2xl text-accent font-bold text-center mb-8">
            Your cart
          </h4>

          {!items.length && (
            <p className="text-center text-primary-light">
              Your cart is empty. Please purchase something.
            </p>
          )}
          <div className="flex flex-col divide-y divide-accent-light">
            {items.map((item, index) => (
              <div
                key={"purchased-item" + index}
                className="flex gap-2 justify-between items-center py-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={strapiImage(item.product.images[0].url)}
                    alt={item.product.name}
                    width={60}
                    height={60}
                    className="rounded-lg hidden md:block"
                  />
                  <span className="text-accent text-sm md:text-base font-medium">
                    {" "}
                    {item.product.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) {
                        updateQuantity(item.product, value);
                      }
                    }}
                    min="1"
                    step="1"
                    className="w-16 p-2 h-full rounded-md focus:outline-none bg-primary-light border border-accent-light focus:bg-primary text-accent mr-4"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                  />
                  <div className="text-accent text-sm font-medium w-20">
                    ${formatNumber(item.product.price)}
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)}>
                    <IconTrash className="w-4 h-4 text-accent" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ModalContent>
        <ModalFooter className="gap-4 items-center">
          <div className="text-primary-light">
            total amount{" "}
            <span className="font-bold text-accent">${formatNumber(getCartTotal())}</span>
          </div>
          <button
            disabled={!items.length}
            className="bg-accent text-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-2 py-1 rounded-md border border-accent w-28"
          >
            Buy now
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}
