import { useEffect, useMemo, useState } from 'react';
import { Product, createOrder, listProducts, Order } from './api';

type CartLine = {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [qtyDraft, setQtyDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const cartTotal = useMemo(
    () => cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    [cart]
  );

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listProducts();
      setProducts(data);

      // Keep cart stock in sync
      setCart((prev) => {
        const next = prev
          .map((line) => {
            const p = data.find((x) => x.id === line.productId);
            if (!p) return null;
            const nextQty = Math.min(line.quantity, p.stock);
            return { ...line, maxStock: p.stock, quantity: nextQty };
          })
          .filter(Boolean) as CartLine[];

        // Drop drafts for removed items
        setQtyDraft((draft) => {
          const nextDraft: Record<string, string> = {};
          for (const line of next) {
            if (draft[line.productId] !== undefined) nextDraft[line.productId] = draft[line.productId];
          }
          return nextDraft;
        });

        return next;
      });
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function addToCart(p: Product) {
    setLastOrder(null);
    setError(null);

    if (p.stock <= 0) {
      setError('This product is out of stock');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((l) => l.productId === p.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + 1, p.stock);
        return prev.map((l) => (l.productId === p.id ? { ...l, quantity: nextQty, maxStock: p.stock } : l));
      }
      return [
        ...prev,
        {
          productId: p.id,
          name: p.name,
          sku: p.sku,
          unitPrice: p.price,
          quantity: 1,
          maxStock: p.stock
        }
      ];
    });
  }

  function updateQty(productId: string, quantity: number) {
    setCart((prev) =>
      prev
        .map((l) => {
          if (l.productId !== productId) return l;
          const nextQty = Math.max(1, Math.min(quantity, l.maxStock));
          return { ...l, quantity: nextQty };
        })
        .filter((l) => l.quantity > 0)
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
    setQtyDraft((prev) => {
      if (prev[productId] === undefined) return prev;
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  function applyDraft(productId: string) {
    setQtyDraft((prev) => {
      const raw = prev[productId];
      if (raw === undefined) return prev;

      const trimmed = raw.trim();
      const parsed = trimmed === '' ? NaN : Number(trimmed);

      const line = cart.find((l) => l.productId === productId);
      if (!line) return prev;

      const normalized = Number.isFinite(parsed) ? Math.max(1, Math.min(Math.trunc(parsed), line.maxStock)) : 1;
      updateQty(productId, normalized);

      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  async function checkout() {
    setLoading(true);
    setError(null);
    setLastOrder(null);
    try {
      if (cart.length === 0) {
        setError('Cart is empty');
        return;
      }

      const order = await createOrder({
        customer: {
          name: customerName || undefined,
          email: customerEmail || undefined
        },
        items: cart.map((l) => ({ productId: l.productId, quantity: l.quantity }))
      });

      setLastOrder(order);
      setCart([]);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <header className="nav">
        <strong>E-Commerce</strong>
        <span className="muted">Browse products and simulate checkout</span>
      </header>

      {error ? (
        <div className="card error" style={{ marginBottom: 12 }}>
          {error}
        </div>
      ) : null}

      {lastOrder ? (
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>Order placed successfully</strong>
            <strong className="price">{formatMoney(lastOrder.total)}</strong>
          </div>

          <div className="muted" style={{ marginTop: 6 }}>
            Order ID: {lastOrder.id}
          </div>

          {lastOrder.customer?.name || lastOrder.customer?.email ? (
            <div className="muted" style={{ marginTop: 6 }}>
              {lastOrder.customer?.name ? <span>Customer: {lastOrder.customer.name}</span> : null}
              {lastOrder.customer?.name && lastOrder.customer?.email ? <span> · </span> : null}
              {lastOrder.customer?.email ? <span>{lastOrder.customer.email}</span> : null}
            </div>
          ) : null}

          <div style={{ overflowX: 'auto', marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Line total</th>
                </tr>
              </thead>
              <tbody>
                {lastOrder.items.map((it) => (
                  <tr key={`${it.productId}-${it.sku}`}>
                    <td>
                      <strong>{it.name}</strong>
                      <div className="muted">SKU: {it.sku}</div>
                    </td>
                    <td>{it.quantity}</td>
                    <td className="price">{formatMoney(it.unitPrice)}</td>
                    <td className="price">{formatMoney(it.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="cols">
        <section className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Products</h2>
            <button type="button" onClick={refresh} disabled={loading}>
              Refresh
            </button>
          </div>

          {products.length === 0 ? (
            <p className="muted">
              No products found. Run backend seed: <code>npm run seed</code>
            </p>
          ) : (
            <table className="table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      <div className="muted">SKU: {p.sku}</div>
                      {p.description ? <div className="muted">{p.description}</div> : null}
                    </td>
                    <td className="price">{formatMoney(p.price)}</td>
                    <td>{p.stock}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button type="button" onClick={() => addToCart(p)} disabled={loading || p.stock <= 0}>
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Cart</h2>
            <span className="muted">{cart.length} items</span>
          </div>

          {cart.length === 0 ? (
            <p className="muted">Cart is empty.</p>
          ) : (
            <div className="grid" style={{ marginTop: 8 }}>
              {cart.map((l) => (
                <div key={l.productId} className="card" style={{ padding: 10 }}>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <div>
                      <strong>{l.name}</strong>
                      <div className="muted">SKU: {l.sku}</div>
                    </div>
                    <button type="button" onClick={() => removeFromCart(l.productId)} disabled={loading}>
                      Remove
                    </button>
                  </div>

                  <div className="row" style={{ marginTop: 8 }}>
                    <label style={{ width: 120 }}>
                      Qty
                      <input
                        value={qtyDraft[l.productId] ?? String(l.quantity)}
                        onChange={(e) => {
                          const v = e.target.value;
                          // allow empty while typing; only digits
                          if (!/^\d*$/.test(v)) return;
                          setQtyDraft((prev) => ({ ...prev, [l.productId]: v }));
                          if (v !== '') updateQty(l.productId, Number(v));
                        }}
                        onBlur={() => applyDraft(l.productId)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur();
                        }}
                        inputMode="numeric"
                      />
                    </label>
                    <div className="muted" style={{ alignSelf: 'end' }}>
                      Max: {l.maxStock}
                    </div>
                  </div>

                  <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
                    <span className="muted">Unit</span>
                    <span className="price">{formatMoney(l.unitPrice)}</span>
                  </div>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <span className="muted">Line total</span>
                    <span className="price">{formatMoney(l.unitPrice * l.quantity)}</span>
                  </div>
                </div>
              ))}

              <hr />

              <label>
                Customer name (optional)
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </label>

              <label>
                Customer email (optional)
                <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="name@example.com" />
              </label>

              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>Total</strong>
                <strong className="price">{formatMoney(cartTotal)}</strong>
              </div>

              <button type="button" onClick={checkout} disabled={loading || cart.length === 0}>
                Checkout
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
