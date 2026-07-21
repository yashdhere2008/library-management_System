function Filter({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: '0.6rem', width: '100%' }}>
      <option value="all">All</option>
      <option value="info">Info</option>
      <option value="warning">Warning</option>
      <option value="success">Success</option>
    </select>
  )
}

export default Filter
