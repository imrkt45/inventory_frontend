import { useState } from "react";
import { PackagePlus, Trash2 } from "lucide-react";
import { apiRequest } from "../api";
import { DataTable } from "../components/DataTable";
import { Input } from "../components/Input";
import { PanelTitle } from "../components/PanelTitle";
import { formatMoney } from "../utils/formatters";

export function ProductsView({ products, refreshAll, showNotice }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock_quantity: "",
  });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await apiRequest("/api/products", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          price: Number(form.price).toFixed(2),
          stock_quantity: Number(form.stock_quantity),
        }),
      });
      setForm({ name: "", sku: "", description: "", price: "", stock_quantity: "" });
      showNotice("success", "Product created");
      await refreshAll();
    } catch (error) {
      showNotice("error", error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiRequest(`/api/products/${id}`, { method: "DELETE" });
      showNotice("success", "Product deleted");
      await refreshAll();
    } catch (error) {
      showNotice("error", error.message);
    }
  };

  return (
    <div className="content-grid">
      <form className="panel form-panel" onSubmit={submit}>
        <PanelTitle icon={PackagePlus} title="Add Product" />
        <Input label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
        <Input label="SKU" value={form.sku} onChange={(sku) => setForm({ ...form, sku })} required />
        <Input
          label="Description"
          value={form.description}
          onChange={(description) => setForm({ ...form, description })}
        />
        <Input
          label="Price"
          type="number"
          step="0.01"
          min="0.01"
          value={form.price}
          onChange={(price) => setForm({ ...form, price })}
          required
        />
        <Input
          label="Stock Quantity"
          type="number"
          min="0"
          value={form.stock_quantity}
          onChange={(stock_quantity) => setForm({ ...form, stock_quantity })}
          required
        />
        <button className="primary-button" type="submit">
          Create Product
        </button>
      </form>

      <DataTable
        title="Product Inventory"
        columns={["Name", "SKU", "Price", "Stock", ""]}
        empty="No products yet"
        rows={products.map((product) => [
          product.name,
          product.sku,
          formatMoney(product.price),
          product.stock_quantity,
          <button className="danger-button" onClick={() => deleteProduct(product.id)} title="Delete product">
            <Trash2 size={16} />
          </button>,
        ])}
      />
    </div>
  );
}
