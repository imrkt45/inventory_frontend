import { useState } from "react";
import { ClipboardList, Trash2 } from "lucide-react";
import { apiRequest } from "../api";
import { DataTable } from "../components/DataTable";
import { Input } from "../components/Input";
import { PanelTitle } from "../components/PanelTitle";
import { formatMoney } from "../utils/formatters";

export function OrdersView({ products, customers, orders, refreshAll, showNotice }) {
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);

  const addItem = () => setItems([...items, { product_id: "", quantity: 1 }]);
  const updateItem = (index, key, value) => {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], [key]: value };
    setItems(nextItems);
  };
  const removeItem = (index) => setItems(items.filter((_, itemIndex) => itemIndex !== index));

  const submit = async (event) => {
    event.preventDefault();
    try {
      await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          customer_id: Number(customerId),
          items: items.map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          })),
        }),
      });
      setCustomerId("");
      setItems([{ product_id: "", quantity: 1 }]);
      showNotice("success", "Order placed and inventory updated");
      await refreshAll();
    } catch (error) {
      showNotice("error", error.message);
    }
  };

  return (
    <div className="content-grid">
      <form className="panel form-panel" onSubmit={submit}>
        <PanelTitle icon={ClipboardList} title="Create Order" />
        <label className="field">
          <span>Customer</span>
          <select value={customerId} onChange={(event) => setCustomerId(event.target.value)} required>
            <option value="">Select customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </label>

        <div className="order-items">
          {items.map((item, index) => (
            <div className="order-row" key={index}>
              <label className="field">
                <span>Product</span>
                <select
                  value={item.product_id}
                  onChange={(event) => updateItem(index, "product_id", event.target.value)}
                  required
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - stock {product.stock_quantity}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="Qty"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(quantity) => updateItem(index, "quantity", quantity)}
                required
              />
              {items.length > 1 && (
                <button className="danger-button order-delete" type="button" onClick={() => removeItem(index)}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="secondary-button" type="button" onClick={addItem}>
          Add Item
        </button>
        <button className="primary-button" type="submit">
          Place Order
        </button>
      </form>

      <DataTable
        title="Recent Orders"
        columns={["Order", "Customer", "Items", "Total", "Status"]}
        empty="No orders yet"
        rows={orders.map((order) => [
          `#${order.id}`,
          order.customer?.name || order.customer_id,
          order.items.map((item) => `${item.product.name} x ${item.quantity}`).join(", "),
          formatMoney(order.total_amount),
          order.status,
        ])}
      />
    </div>
  );
}
