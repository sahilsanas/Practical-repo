export type Product = {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  customer?: { name?: string; email?: string };
  items: OrderItem[];
  total: number;
  status: 'created';
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8082/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.message as string)) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export async function listProducts(): Promise<Product[]> {
  const data = await http<{ products: Product[] }>(`/products`);
  return data.products;
}

export async function createOrder(input: {
  customer?: { name?: string; email?: string };
  items: { productId: string; quantity: number }[];
}): Promise<Order> {
  const data = await http<{ order: Order }>(`/orders`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  return data.order;
}
