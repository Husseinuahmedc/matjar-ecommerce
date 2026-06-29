export async function getCart(_userId: string) {
  return null;
}

export async function addItem(_userId: string, _productId: string, _quantity: number, _price: number) {
  return {};
}

export async function updateItem(_userId: string, _cartItemId: string, _quantity: number) {
  return {};
}

export async function removeItem(_userId: string, _cartItemId: string) {
  return {};
}

export async function clearCart(_userId: string) {}

export async function mergeGuestCart(_userId: string, _guestItems: { productId: string; quantity: number }[]) {}
