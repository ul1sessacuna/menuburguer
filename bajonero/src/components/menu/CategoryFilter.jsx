const CATEGORIES = [
  { id: 'all',      name: 'Todo' },
  { id: 'burgers',  name: 'Burgers' },
  { id: 'combos',   name: 'Combos' },
  { id: 'sides',    name: 'Sides' },
  { id: 'drinks',   name: 'Bebidas' },
  { id: 'desserts', name: 'Postres' },
  { id: 'extras',   name: 'Extras' },
]

export { CATEGORIES }

export default function CategoryFilter({ active, onChange, availableCategories }) {
  const visible = CATEGORIES.filter((c) => c.id === 'all' || availableCategories.includes(c.id))

  return (
    <div className="scrollbar-none" style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0 4px' }}>
      {visible.map(({ id, name }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flexShrink: 0, padding: '8px 18px', borderRadius: '100px',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '0.85rem', fontWeight: isActive ? 800 : 500,
              backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.07)',
              color: isActive ? '#000' : 'rgba(255,255,255,0.38)',
              transition: 'all 150ms ease',
            }}
          >
            {name}
          </button>
        )
      })}
    </div>
  )
}
