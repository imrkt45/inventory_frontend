import { useEffect, useMemo, useState } from "react";
import {
  CssBaseline,
  FormControlLabel,
  Switch,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  AlertCircle,
  Boxes,
  CheckCircle2,
  PackagePlus,
  RefreshCw,
  ShoppingCart,
  Users,
} from "lucide-react";
import { API_BASE_URL, apiRequest } from "./api";
import { Metric } from "./components/Metric";
import { TabButton } from "./components/TabButton";
import { CustomersView } from "./views/CustomersView";
import { OrdersView } from "./views/OrdersView";
import { ProductsView } from "./views/ProductsView";
import { formatMoney } from "./utils/formatters";

export function App() {
  const [activeTab, setActiveTab] = useState("products");
  const [themeMode, setThemeMode] = useState("light");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const refreshAll = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const [productData, customerData, orderData] = await Promise.all([
        apiRequest("/api/products"),
        apiRequest("/api/customers"),
        apiRequest("/api/orders"),
      ]);
      setProducts(productData);
      setCustomers(customerData);
      setOrders(orderData);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const stats = useMemo(() => {
    const stock = products.reduce((sum, product) => sum + product.stock_quantity, 0);
    const revenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    return { stock, revenue };
  }, [products, orders]);

  const showNotice = (type, text) => setNotice({ type, text });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: "#0f766e",
          },
          background: {
            default: themeMode === "dark" ? "#111827" : "#eef2f5",
          },
        },
        shape: {
          borderRadius: 8,
        },
        typography: {
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }),
    [themeMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className="app-shell" data-theme={themeMode}>
        <aside className="sidebar">
          <div>
            <div className="brand">
              <Boxes size={28} />
              <div>
                <strong>Inventory</strong>
                <span>Order Management</span>
              </div>
            </div>

            <nav className="nav-tabs" aria-label="Primary">
              <TabButton active={activeTab === "products"} onClick={() => setActiveTab("products")} icon={PackagePlus}>
                Products
              </TabButton>
              <TabButton active={activeTab === "customers"} onClick={() => setActiveTab("customers")} icon={Users}>
                Customers
              </TabButton>
              <TabButton active={activeTab === "orders"} onClick={() => setActiveTab("orders")} icon={ShoppingCart}>
                Orders
              </TabButton>
            </nav>
          </div>

          <div className="theme-panel" aria-label="Theme settings">
            <span>Theme</span>
            <FormControlLabel
              control={
                <Switch
                  checked={themeMode === "dark"}
                  onChange={(event) => setThemeMode(event.target.checked ? "dark" : "light")}
                  color="primary"
                />
              }
              label="Dark mode"
            />
          </div>
        </aside>

        <section className="workspace">
          <header className="topbar">
            <div>
              <h1>{activeTab[0].toUpperCase() + activeTab.slice(1)}</h1>
              <p>API: {API_BASE_URL}</p>
            </div>
            <button className="icon-button" onClick={refreshAll} disabled={loading} title="Refresh data">
              <RefreshCw size={18} />
              Refresh
            </button>
          </header>

          <section className="metrics" aria-label="Summary">
            <Metric label="Products" value={products.length} />
            <Metric label="Customers" value={customers.length} />
            <Metric label="Orders" value={orders.length} />
            <Metric label="Stock Units" value={stats.stock} />
            <Metric label="Revenue" value={formatMoney(stats.revenue)} />
          </section>

          {notice && (
            <div className={`notice ${notice.type}`}>
              {notice.type === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>{notice.text}</span>
            </div>
          )}

          {activeTab === "products" && (
            <ProductsView products={products} refreshAll={refreshAll} showNotice={showNotice} />
          )}
          {activeTab === "customers" && (
            <CustomersView customers={customers} refreshAll={refreshAll} showNotice={showNotice} />
          )}
          {activeTab === "orders" && (
            <OrdersView
              products={products}
              customers={customers}
              orders={orders}
              refreshAll={refreshAll}
              showNotice={showNotice}
            />
          )}
        </section>
      </main>
    </ThemeProvider>
  );
}
