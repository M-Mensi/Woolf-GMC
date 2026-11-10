import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const money = (amount) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const type = response.headers.get("content-type") || "";
  if (!type.includes("application/json")) {
    throw new Error("The shop API is unavailable. Check the server and database connection.");
  }
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Something went wrong.");
  return body;
}

function ProductImage({ product, className = "" }) {
  const [failed, setFailed] = useState(false);
  return product.image && !failed ? (
    <img className={className} src={product.image} alt={product.name} onError={() => setFailed(true)} />
  ) : (
    <div className={`product-placeholder ${className}`} aria-label={product.name}>
      <span>{product.category?.slice(0, 1) || "F"}</span>
    </div>
  );
}

function Icon({ name }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function App() {
  const [products, setProducts] = useState([]);
  const [catalogReady, setCatalogReady] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("form-field-cart") || "[]");
    } catch {
      return [];
    }
  });
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  async function loadProducts() {
    const data = await request("/api/products");
    setProducts(data);
    setCatalogReady(true);
  }

  useEffect(() => {
    loadProducts().catch((error) => setNotice(error.message));
    request("/api/auth/me")
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem("form-field-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!catalogReady) return;
    setCart((items) =>
      items
        .map((item) => {
          const current = products.find((product) => product._id === item._id);
          return current
            ? { ...current, quantity: Math.min(item.quantity, current.stock) }
            : null;
        })
        .filter((item) => item && item.quantity > 0)
    );
  }, [catalogReady, products]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category))],
    [products]
  );
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch =
        !query ||
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function addToCart(product) {
    setCart((items) => {
      const existing = items.find((item) => item._id === product._id);
      if (existing) {
        return items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added to your bag.`);
    setTimeout(() => setNotice(""), 2600);
  }

  function updateQuantity(id, amount) {
    setCart((items) =>
      items
        .map((item) => {
          if (item._id !== id) return item;
          const product = products.find((entry) => entry._id === id);
          return {
            ...item,
            quantity: Math.min(item.quantity + amount, product?.stock ?? item.quantity),
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  async function submitAuth(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await request(`/api/auth/${authMode === "register" ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      setUser(result.user);
      setModal("");
      setNotice(`Welcome${authMode === "register" ? ", " + result.user.name : " back"}!`);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await request("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOrders([]);
  }

  async function showOrders() {
    setBusy(true);
    try {
      setOrders(await request("/api/orders/mine"));
      setModal("orders");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function checkout(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const form = event.currentTarget;
    const shipping = Object.fromEntries(new FormData(form));
    try {
      await request("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          shipping,
          items: cart.map((item) => ({ product: item._id, quantity: item.quantity })),
        }),
      });
      setCart([]);
      setModal("");
      setNotice("Order placed. Payment is due on delivery.");
      await loadProducts();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveProduct(event) {
    event.preventDefault();
    setBusy(true);
    const form = event.currentTarget;
    try {
      await request(
        editingProduct ? `/api/products/${editingProduct._id}` : "/api/products",
        {
        method: editingProduct ? "PUT" : "POST",
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form)),
          featured: new FormData(form).get("featured") === "true",
        }),
        }
      );
      await loadProducts();
      form.reset();
      setNotice(editingProduct ? "Product updated." : "Product added to the catalog.");
      setModal("");
      setEditingProduct(null);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Remove this product from the catalog?")) return;
    try {
      await request(`/api/products/${id}`, { method: "DELETE" });
      setProducts((items) => items.filter((item) => item._id !== id));
      setCart((items) => items.filter((item) => item._id !== id));
    } catch (error) {
      setNotice(error.message);
    }
  }

  function editProduct(product) {
    setEditingProduct(product);
    setModal("admin");
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Form and Field home">form<span>&</span>field<span className="brand-period">.</span></a>
        <nav className="desktop-nav" aria-label="Shop">
          <a href="#shop">Shop all</a>
          <a href="#story">Our approach</a>
          <a href="#footer">Journal</a>
        </nav>
        <div className="header-actions">
          <label className="header-search"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search..." aria-label="Search products" /></label>
          {user ? (
            <div className="account-actions">
              <button className="account-button" onClick={showOrders}>{user.name.split(" ")[0]}</button>
              {user.role === "admin" && <button className="account-button admin-button" onClick={() => { setEditingProduct(null); setModal("admin"); }}>Add item</button>}
              <button className="account-button logout-button" onClick={logout}>Sign out</button>
            </div>
          ) : (
            <button className="account-button" onClick={() => { setAuthMode("login"); setModal("auth"); }}>Sign in</button>
          )}
          <button className="bag-button" onClick={() => setModal("cart")} aria-label={`Open shopping bag, ${cartCount} items`}>
            <Icon name="bag" /><span>Bag</span><b>{cartCount}</b>
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">Objects for the everyday</p>
            <h1>Keep good<br />things <em>close.</em></h1>
            <p className="hero-copy">Considered pieces for slower mornings, softer spaces, and all the little rituals in between.</p>
            <a className="hero-cta" href="#shop">Find your everyday <span>↓</span></a>
          </div>
          <div className="hero-art">
            <div className="sun-disc" />
            <div className="hero-vase"><span /></div>
            <div className="hero-table" />
            <p>Made for the<br />moments that matter.</p>
          </div>
          <span className="hero-side-note">A LITTLE LESS, A LITTLE BETTER · EST. 2024</span>
        </section>

        <section className="shop-section" id="shop">
          <div className="shop-heading">
            <div><p className="eyebrow">The collection</p><h2>Everyday, <em>elevated.</em></h2></div>
            <p>Useful things with a little more thought<br />behind them.</p>
          </div>
          <div className="shop-toolbar">
            <div className="category-list" aria-label="Filter by category">
              {categories.map((item) => <button key={item} className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <span className="product-count">{visibleProducts.length} pieces</span>
          </div>
          {visibleProducts.length ? (
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <article className="product-card" key={product._id}>
                  <div className={`product-media tone-${index % 4}`}>
                    <ProductImage product={product} />
                    {product.featured && <span className="product-badge">Bestseller</span>}
                    <button className="quick-add" disabled={product.stock < 1} onClick={() => addToCart(product)}>
                      {product.stock ? "Add to bag  +" : "Sold out"}
                    </button>
                    {user?.role === "admin" && (
                      <div className="admin-product-actions">
                        <button aria-label={`Edit ${product.name}`} onClick={() => editProduct(product)}>Edit</button>
                        <button aria-label={`Delete ${product.name}`} onClick={() => deleteProduct(product._id)}>×</button>
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <div><p>{product.category}</p><h3>{product.name}</h3></div>
                    <span>{money(product.price)}</span>
                  </div>
                  <p className="product-description">{product.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-shop"><span>✳</span><h3>{products.length ? "Nothing here just yet." : "A good thing is on its way."}</h3><p>{products.length ? "Try another search or category." : "Our first collection is being carefully gathered."}</p></div>
          )}
        </section>

        <section className="story-section" id="story">
          <div className="story-mark">f<span>&</span>f</div>
          <div><p className="eyebrow">A note on buying well</p><h2>Fewer things.<br /><em>More meaning.</em></h2></div>
          <p>We believe the things you live with should earn their place. We look for useful forms, honest materials, and thoughtful details — pieces to reach for every day, and keep for a long time.</p>
          <a href="#shop">A little more about us <span>↗</span></a>
        </section>

      </main>

      <footer className="site-footer" id="footer">
        <a className="brand" href="#">form<span>&</span>field<span className="brand-period">.</span></a>
        <p>Good things, for every day.</p>
        <span>© {new Date().getFullYear()} Form &amp; Field</span>
      </footer>

      {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")}><Icon name="close" /></button></div>}

      {modal && (
        <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(""); }}>
          {modal === "cart" && (
            <aside className="drawer" aria-label="Shopping bag">
              <div className="drawer-heading"><div><p className="eyebrow">Your selection</p><h2>Your bag <span>({cartCount})</span></h2></div><button className="close-button" onClick={() => setModal("")} aria-label="Close bag"><Icon name="close" /></button></div>
              {!cart.length ? <div className="cart-empty"><span>○</span><h3>Your bag is taking a breather.</h3><p>Find something lovely for your everyday.</p><button className="dark-button" onClick={() => setModal("")}>Explore the collection</button></div> : (
                <>
                  <div className="cart-items">{cart.map((item) => <article className="cart-item" key={item._id}><ProductImage product={item} /><div className="cart-item-info"><h3>{item.name}</h3><span>{money(item.price)}</span><div className="quantity"><button onClick={() => updateQuantity(item._id, -1)} aria-label={`Remove one ${item.name}`}><Icon name="minus" /></button><span>{item.quantity}</span><button disabled={item.quantity >= item.stock} onClick={() => updateQuantity(item._id, 1)} aria-label={`Add one ${item.name}`}><Icon name="plus" /></button></div></div><strong>{money(item.price * item.quantity)}</strong></article>)}</div>
                  <div className="cart-summary"><div><span>Subtotal</span><strong>{money(cartTotal)}</strong></div><p>Shipping and any applicable taxes are calculated at checkout.</p><button className="dark-button" onClick={() => { if (!user) { setAuthMode("login"); setModal("auth"); } else setModal("checkout"); }}>Continue to checkout <Icon name="arrow" /></button></div>
                </>
              )}
            </aside>
          )}

          {modal === "auth" && (
            <section className="modal-card">
              <button className="close-button modal-close" onClick={() => setModal("")} aria-label="Close"><Icon name="close" /></button>
              <p className="eyebrow">{authMode === "login" ? "Welcome back" : "Join our little corner"}</p>
              <h2>{authMode === "login" ? "Sign in." : "Create an account."}</h2>
              <form className="stack-form" onSubmit={submitAuth}>
                {authMode === "register" && <label>Your name<input name="name" autoComplete="name" maxLength="100" required /></label>}
                <label>Email address<input name="email" type="email" autoComplete="email" maxLength="254" required /></label>
                <label>Password<input name="password" type="password" autoComplete={authMode === "login" ? "current-password" : "new-password"} minLength="8" maxLength="128" required /></label>
                <button className="dark-button" disabled={busy}>{busy ? "One moment…" : authMode === "login" ? "Sign in" : "Create account"}</button>
              </form>
              <p className="switch-auth">{authMode === "login" ? "New around here?" : "Already have an account?"} <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>{authMode === "login" ? "Create an account" : "Sign in"}</button></p>
            </section>
          )}

          {modal === "checkout" && (
            <section className="modal-card checkout-modal">
              <button className="close-button modal-close" onClick={() => setModal("cart")} aria-label="Back to bag"><Icon name="close" /></button>
              <p className="eyebrow">Almost yours</p><h2>Delivery details.</h2>
              <form className="stack-form" onSubmit={checkout}>
                <label>Full name<input name="name" autoComplete="name" defaultValue={user?.name || ""} maxLength="100" required /></label>
                <label>Street address<input name="address" autoComplete="street-address" maxLength="200" required /></label>
                <div className="form-row"><label>City<input name="city" autoComplete="address-level2" maxLength="100" required /></label><label>Postal code<input name="postalCode" autoComplete="postal-code" maxLength="20" required /></label></div>
                <div className="payment-note"><span>Payment</span><strong>Cash on delivery</strong><small>Pay when your order arrives.</small></div>
                <div className="checkout-total"><span>Total</span><strong>{money(cartTotal)}</strong></div>
                <button className="dark-button" disabled={busy || !cart.length}>{busy ? "Placing order…" : "Place order"}</button>
              </form>
            </section>
          )}

          {modal === "orders" && (
            <section className="modal-card orders-modal">
              <button className="close-button modal-close" onClick={() => setModal("")} aria-label="Close"><Icon name="close" /></button>
              <p className="eyebrow">Your account</p><h2>Your orders.</h2>
              {!orders.length ? <div className="orders-empty">No orders just yet. Your next favorite thing might be here.</div> : <div className="orders-list">{orders.map((order) => <article key={order._id}><div><strong>Order {order._id.slice(-7).toUpperCase()}</strong><span>{new Date(order.createdAt).toLocaleDateString()}</span></div><span className="order-status">{order.status}</span><strong>{money(order.total)}</strong><small>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(" · ")}</small></article>)}</div>}
              <button className="dark-button" onClick={() => setModal("")}>Back to the shop</button>
            </section>
          )}

          {modal === "admin" && user?.role === "admin" && (
            <section className="modal-card admin-modal">
              <button className="close-button modal-close" onClick={() => { setModal(""); setEditingProduct(null); }} aria-label="Close"><Icon name="close" /></button>
              <p className="eyebrow">Shop management</p><h2>{editingProduct ? "Edit product." : "Add a product."}</h2>
              <form className="stack-form" key={editingProduct?._id || "new-product"} onSubmit={saveProduct}>
                <label>Product name<input name="name" defaultValue={editingProduct?.name || ""} maxLength="160" required /></label>
                <label>Description<textarea name="description" defaultValue={editingProduct?.description || ""} rows="3" maxLength="3000" required /></label>
                <div className="form-row"><label>Category<input name="category" defaultValue={editingProduct?.category || ""} maxLength="80" required /></label><label>Price (USD)<input name="price" type="number" defaultValue={editingProduct?.price ?? ""} min="0" step="0.01" required /></label></div>
                <div className="form-row"><label>Stock<input name="stock" type="number" defaultValue={editingProduct?.stock ?? 1} min="0" step="1" required /></label><label>Image URL<input name="image" type="url" defaultValue={editingProduct?.image || ""} maxLength="2000" /></label></div>
                <label className="checkbox-label"><input name="featured" type="checkbox" value="true" defaultChecked={editingProduct?.featured || false} /> Feature this item</label>
                <button className="dark-button" disabled={busy}>{busy ? "Saving…" : editingProduct ? "Save changes" : "Add to collection"}</button>
              </form>
            </section>
          )}
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
