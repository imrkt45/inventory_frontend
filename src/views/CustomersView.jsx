import { useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { apiRequest } from "../api";
import { DataTable } from "../components/DataTable";
import { Input } from "../components/Input";
import { PanelTitle } from "../components/PanelTitle";

export function CustomersView({ customers, refreshAll, showNotice }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await apiRequest("/api/customers", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", email: "", phone: "" });
      showNotice("success", "Customer created");
      await refreshAll();
    } catch (error) {
      showNotice("error", error.message);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await apiRequest(`/api/customers/${id}`, { method: "DELETE" });
      showNotice("success", "Customer deleted");
      await refreshAll();
    } catch (error) {
      showNotice("error", error.message);
    }
  };

  return (
    <div className="content-grid">
      <form className="panel form-panel" onSubmit={submit}>
        <PanelTitle icon={UserPlus} title="Add Customer" />
        <Input label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} required />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(email) => setForm({ ...form, email })}
          required
        />
        <Input label="Phone" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
        <button className="primary-button" type="submit">
          Create Customer
        </button>
      </form>

      <DataTable
        title="Customers"
        columns={["Name", "Email", "Phone", ""]}
        empty="No customers yet"
        rows={customers.map((customer) => [
          customer.name,
          customer.email,
          customer.phone || "-",
          <button className="danger-button" onClick={() => deleteCustomer(customer.id)} title="Delete customer">
            <Trash2 size={16} />
          </button>,
        ])}
      />
    </div>
  );
}
