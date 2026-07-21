function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search notifications"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: '0.6rem', width: '100%' }}
    />
  )
}

export default SearchBar
