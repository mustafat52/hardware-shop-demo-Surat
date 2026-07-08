export function formatCurrency(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export function generateCartId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CART-${num}`;
}
