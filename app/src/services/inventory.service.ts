export const LOW_STOCK_THRESHOLD = 5;

export async function updateStock(
  _productId: string,
  _newQuantity: number,
  _sellerId?: string
): Promise<void> {}

export async function decrementStock(
  _items: Array<{ productId: string; quantity: number }>
): Promise<void> {}

export async function restoreStock(
  _items: Array<{ productId: string; quantity: number }>
): Promise<void> {}

export async function checkLowStock(_productIds: string[]): Promise<string[]> {
  return [];
}
