export function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button className={active ? "tab active" : "tab"} onClick={onClick}>
      <Icon size={18} />
      {children}
    </button>
  );
}
