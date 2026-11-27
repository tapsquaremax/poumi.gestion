
import { useEffect, useMemo, useState } from 'react'
import './Inventory.css'

type MeasureType = 'weight' | 'volume' | 'count'
type Unit = 'g' | 'kg' | 'mg' | 'ml' | 'l' | 'unidad'
type MovementType = 'initial' | 'entry'

type Ingredient = {
  id: number
  name: string
  category: string
  measureType: MeasureType
  stock: number
  minStock: number
  averageCost: number
}

type Movement = {
  id: number
  ingredientId: number
  ingredientName: string
  type: MovementType
  quantity: number
  enteredQuantity: number
  enteredUnit: Unit
  totalCost: number
  date: string
}

const units: Record<MeasureType, Unit[]> = {
  weight: ['g', 'kg', 'mg'],
  volume: ['ml', 'l'],
  count: ['unidad'],
}

const factors: Record<Unit, number> = {
  g: 1,
  kg: 1000,
  mg: 0.001,
  ml: 1,
  l: 1000,
  unidad: 1,
}

const baseUnits: Record<MeasureType, Unit> = {
  weight: 'g',
  volume: 'ml',
  count: 'unidad',
}

const initialIngredients: Ingredient[] = [
  { id: 1, name: 'Harina 0000', category: 'Harinas y cereales', measureType: 'weight', stock: 5000, minStock: 1000, averageCost: 2 },
  { id: 2, name: 'Azúcar común', category: 'Azúcares y endulzantes', measureType: 'weight', stock: 3000, minStock: 1000, averageCost: 1.5 },
  { id: 3, name: 'Huevos', category: 'Huevos', measureType: 'count', stock: 12, minStock: 10, averageCost: 350 },
  { id: 4, name: 'Manteca', category: 'Lácteos', measureType: 'weight', stock: 500, minStock: 1000, averageCost: 8.5 },
  { id: 5, name: 'Chocolate cobertura', category: 'Chocolates y cacao', measureType: 'weight', stock: 2000, minStock: 500, averageCost: 12 },
]

const initialCategories = [
  'Harinas y cereales',
  'Azúcares y endulzantes',
  'Lácteos',
  'Huevos',
  'Chocolates y cacao',
  'Frutas',
  'Frutos secos',
  'Esencias y saborizantes',
  'Otros',
]

function normalizeName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es')
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 3,
  }).format(value)
}

function formatMoney(value: number) {
  return value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  })
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

type InventoryProps = {
  openEntryRequest: number
  onEntryRequestHandled: () => void
}

function Inventory({
  openEntryRequest,
  onEntryRequestHandled,
}: InventoryProps) {
  const [ingredients, setIngredients] = useState(initialIngredients)
  const [categories, setCategories] = useState(initialCategories)
  const [movements, setMovements] = useState<Movement[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [displayUnits, setDisplayUnits] = useState<Record<number, Unit>>({})

  const [modal, setModal] = useState<'new' | 'entry' | 'edit' | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [duplicate, setDuplicate] = useState<Ingredient | null>(null)
  const [error, setError] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category: initialCategories[0],
    measureType: 'weight' as MeasureType,
    unit: 'kg' as Unit,
    stock: '',
    minStock: '',
    initialCost: '',
  })

  const [entryForm, setEntryForm] = useState({
    ingredientId: '',
    quantity: '',
    unit: 'kg' as Unit,
    totalCost: '',
    date: new Date().toISOString().slice(0, 10),
  })

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'Todas' || item.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [ingredients, search, categoryFilter])

  const lowStock = ingredients.filter(
    (item) => item.stock <= item.minStock
  ).length

  const totalValue = ingredients.reduce(
    (total, item) => total + item.stock * item.averageCost,
    0
  )

  function getPreferredUnit(item: Ingredient): Unit {
    return item.measureType === 'weight'
      ? 'kg'
      : item.measureType === 'volume'
        ? 'l'
        : 'unidad'
  }

  function getDisplayUnit(item: Ingredient): Unit {
    return displayUnits[item.id] || getPreferredUnit(item)
  }

  function addMovement(
    ingredient: Ingredient,
    type: MovementType,
    quantity: number,
    enteredQuantity: number,
    enteredUnit: Unit,
    totalCost: number,
    date: string
  ) {
    setMovements((previous) => [
      {
        id: Date.now() + Math.random(),
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        type,
        quantity,
        enteredQuantity,
        enteredUnit,
        totalCost,
        date: new Date(`${date}T12:00:00`).toISOString(),
      },
      ...previous,
    ])
  }

  function openNewIngredient() {
    setEditingId(null)
    setDuplicate(null)
    setError('')
    setShowNewCategory(false)
    setForm({
      name: '',
      category: categories[0] || 'Otros',
      measureType: 'weight',
      unit: 'kg',
      stock: '',
      minStock: '',
      initialCost: '',
    })
    setModal('new')
  }

  function openEntry() {
    setError('')
    setDuplicate(null)
    setEntryForm({
      ingredientId: '',
      quantity: '',
      unit: 'kg',
      totalCost: '',
      date: new Date().toISOString().slice(0, 10),
    })
    setModal('entry')
  }

  useEffect(() => {
    if (openEntryRequest > 0) {
      openEntry()
      onEntryRequestHandled()
    }
  }, [openEntryRequest])

  function openEditIngredient(item: Ingredient) {
    const unit = getPreferredUnit(item)

    setEditingId(item.id)
    setError('')
    setForm({
      name: item.name,
      category: item.category,
      measureType: item.measureType,
      unit,
      stock: '',
      minStock: String(item.minStock / factors[baseUnits[item.measureType]]),
      initialCost: '',
    })
    setModal('edit')
  }

  function handleMeasureTypeChange(type: MeasureType) {
    setForm((previous) => ({
      ...previous,
      measureType: type,
      unit: units[type][0],
    }))
  }

  function handleSaveIngredient() {
    setError('')

    if (!form.name.trim()) {
      setError('Ingresá el nombre del ingrediente.')
      return
    }

    const stock = Number(form.stock)
    const minStock = Number(form.minStock)
    const initialCost = Number(form.initialCost)

    if (
      form.minStock.trim() === '' ||
      !Number.isFinite(minStock) ||
      minStock < 0
    ) {
      setError('Ingresá un stock mínimo válido.')
      return
    }

    if (modal === 'new') {
      if (
        form.stock.trim() === '' ||
        !Number.isFinite(stock) ||
        stock < 0 ||
        form.initialCost.trim() === '' ||
        !Number.isFinite(initialCost) ||
        initialCost < 0
      ) {
        setError('Revisá el stock inicial y su costo total.')
        return
      }

      const existing = ingredients.find(
        (item) => normalizeName(item.name) === normalizeName(form.name)
      )

      if (existing) {
        setDuplicate(existing)
        return
      }

      const quantityInBase = stock * factors[form.unit]
      const minimumInBase = minStock * factors[form.unit]
      const averageCost = quantityInBase > 0
        ? initialCost / quantityInBase
        : 0

      const ingredient: Ingredient = {
        id: Date.now(),
        name: form.name.trim().replace(/\s+/g, ' '),
        category: form.category,
        measureType: form.measureType,
        stock: quantityInBase,
        minStock: minimumInBase,
        averageCost,
      }

      setIngredients((previous) => [...previous, ingredient])
      setDisplayUnits((previous) => ({ ...previous, [ingredient.id]: form.unit }))

      addMovement(
        ingredient,
        'initial',
        quantityInBase,
        stock,
        form.unit,
        initialCost,
        new Date().toISOString().slice(0, 10)
      )

      setModal(null)
      return
    }

    if (modal === 'edit' && editingId !== null) {
      const duplicateName = ingredients.find(
        (item) =>
          item.id !== editingId &&
          normalizeName(item.name) === normalizeName(form.name)
      )

      if (duplicateName) {
        setError('Ese nombre ya pertenece a otro ingrediente.')
        return
      }

      setIngredients((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name.trim().replace(/\s+/g, ' '),
                category: form.category,
                minStock: minStock * factors[form.unit],
              }
            : item
        )
      )

      setModal(null)
    }
  }

  function confirmDuplicateEntry() {
    if (!duplicate) return

    if (duplicate.measureType !== form.measureType) {
      setError('El ingrediente existente tiene otro tipo de medida.')
      return
    }

    setEntryForm({
      ingredientId: String(duplicate.id),
      quantity: form.stock,
      unit: form.unit,
      totalCost: '',
      date: new Date().toISOString().slice(0, 10),
    })

    setModal('entry')
    setDuplicate(null)
    setError('')
  }

  function handleRegisterEntry() {
    setError('')

    const ingredient = ingredients.find(
      (item) => item.id === Number(entryForm.ingredientId)
    )

    const quantity = Number(entryForm.quantity)
    const totalCost = Number(entryForm.totalCost)

    if (!ingredient) {
      setError('Seleccioná un ingrediente.')
      return
    }

    if (
      !entryForm.quantity.trim() ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      setError('Ingresá una cantidad mayor que cero.')
      return
    }

    if (
      entryForm.totalCost.trim() === '' ||
      !Number.isFinite(totalCost) ||
      totalCost < 0
    ) {
      setError('Ingresá el precio total de la compra.')
      return
    }

    const quantityInBase = quantity * factors[entryForm.unit]

    const newStock = ingredient.stock + quantityInBase
    const newAverageCost = newStock > 0
      ? (
          ingredient.stock * ingredient.averageCost + totalCost
        ) / newStock
      : 0

    const updatedIngredient = {
      ...ingredient,
      stock: newStock,
      averageCost: newAverageCost,
    }

    setIngredients((previous) =>
      previous.map((item) =>
        item.id === ingredient.id ? updatedIngredient : item
      )
    )

    addMovement(
      ingredient,
      'entry',
      quantityInBase,
      quantity,
      entryForm.unit,
      totalCost,
      entryForm.date
    )

    setModal(null)
  }

  function handleAddCategory() {
    const name = newCategory.trim().replace(/\s+/g, ' ')
    if (!name) return

    const existing = categories.find(
      (category) => normalizeName(category) === normalizeName(name)
    )

    if (existing) {
      setForm((previous) => ({ ...previous, category: existing }))
    } else {
      setCategories((previous) => [...previous, name])
      setForm((previous) => ({ ...previous, category: name }))
    }

    setNewCategory('')
    setShowNewCategory(false)
  }

  function changeDisplayUnit(id: number, unit: Unit) {
    setDisplayUnits((previous) => ({ ...previous, [id]: unit }))
  }

  function getDisplayStock(item: Ingredient) {
    const unit = getDisplayUnit(item)
    return `${formatNumber(item.stock / factors[unit])} ${unit}`
  }

  function selectedEntryIngredient() {
    return ingredients.find(
      (item) => item.id === Number(entryForm.ingredientId)
    )
  }

  return (
    <div className="inventory-page">
      <div className="inventory-heading">
        <div>
          <span className="inventory-eyebrow">GESTIÓN DE INSUMOS</span>
          <h2>Inventario</h2>
          <p>Controlá tus ingredientes y mantené tu stock organizado.</p>
        </div>

        <div className="inventory-heading-actions">
          <button
            className="inventory-secondary-button"
            onClick={openEntry}
          >
            + Registrar entrada
          </button>
          <button
            className="inventory-primary-button"
            onClick={openNewIngredient}
          >
            + Nuevo ingrediente
          </button>
        </div>
      </div>

      <div className="inventory-stats">
        <article className="inventory-stat">
          <span>Ingredientes registrados</span>
          <strong>{ingredients.length}</strong>
          <small>Registros únicos</small>
        </article>
        <article className="inventory-stat">
          <span>Stock bajo</span>
          <strong className="low-stock-number">{lowStock}</strong>
          <small>Requieren atención</small>
        </article>
        <article className="inventory-stat">
          <span>Valor del inventario</span>
          <strong>{formatMoney(totalValue)}</strong>
          <small>Estimación según costo promedio</small>
        </article>
      </div>

      <section className="inventory-table-panel">
        <div className="inventory-table-heading">
          <div>
            <h3>Ingredientes</h3>
            <p>Consultá y administrá tus materias primas.</p>
          </div>
          <span className="ingredient-count">
            {filteredIngredients.length} resultados
          </span>
        </div>

        <div className="inventory-filters">
          <input
            type="search"
            placeholder="Buscar ingrediente..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="inventory-table-scroll">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Categoría</th>
                <th>Stock actual</th>
                <th>Stock mínimo</th>
                <th>Costo promedio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((item) => {
                const isLow = item.stock <= item.minStock
                const unit = getDisplayUnit(item)

                return (
                  <tr key={item.id}>
                    <td className="ingredient-name">{item.name}</td>
                    <td>{item.category}</td>
                    <td>
                      <strong>{getDisplayStock(item)}</strong>
                      <select
                        className="stock-unit-select"
                        value={unit}
                        aria-label={`Unidad de visualización de ${item.name}`}
                        onChange={(event) =>
                          changeDisplayUnit(item.id, event.target.value as Unit)
                        }
                      >
                        {units[item.measureType].map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>{formatNumber(item.minStock / factors[unit])} {unit}</td>
                    <td>{formatMoney(item.averageCost * factors[unit])} / {unit}</td>
                    <td>
                      <span className={`stock-status ${isLow ? 'status-low' : 'status-ok'}`}>
                        {isLow ? 'Stock bajo' : 'Disponible'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="inventory-edit-button"
                        onClick={() => openEditIngredient(item)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredIngredients.length === 0 && (
                <tr>
                  <td colSpan={7} className="inventory-empty">
                    No encontramos ingredientes con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="inventory-table-panel movement-panel">
        <div className="inventory-table-heading">
          <div>
            <h3>Movimientos recientes</h3>
            <p>Historial de entradas de ingredientes.</p>
          </div>
          <span className="ingredient-count">
            {movements.length} movimientos
          </span>
        </div>

        {movements.length === 0 ? (
          <div className="inventory-empty">
            Los movimientos que registres aparecerán acá.
          </div>
        ) : (
          <div className="inventory-table-scroll">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Ingrediente</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Precio total</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{formatDate(movement.date)}</td>
                    <td className="ingredient-name">{movement.ingredientName}</td>
                    <td>{movement.type === 'initial' ? 'Stock inicial' : 'Compra / reposición'}</td>
                    <td className="movement-entry">
                      + {formatNumber(movement.enteredQuantity)} {movement.enteredUnit}
                    </td>
                    <td>{formatMoney(movement.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal && (
        <div
          className="inventory-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null)
              setDuplicate(null)
            }
          }}
        >
          <section className="inventory-modal">
            <div className="inventory-modal-heading">
              <div>
                <span className="inventory-eyebrow">GESTIÓN DE INSUMOS</span>
                <h3>
                  {modal === 'new'
                    ? 'Nuevo ingrediente'
                    : modal === 'entry'
                      ? 'Registrar entrada'
                      : 'Editar ingrediente'}
                </h3>
                <p>
                  {modal === 'new'
                    ? 'Incorporá un ingrediente al inventario.'
                    : modal === 'entry'
                      ? 'Registrá una compra o reposición.'
                      : 'Modificá los datos del ingrediente.'}
                </p>
              </div>
              <button
                className="inventory-close-button"
                onClick={() => setModal(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {modal === 'entry' ? (
              <div className="inventory-form">
                <label>
                  Buscar ingrediente
                  <input
                    list="inventory-ingredient-options"
                    placeholder="Escribí para buscar..."
                    value={
                      ingredients.find((item) => item.id === Number(entryForm.ingredientId))?.name || ''
                    }
                    onChange={(event) => {
                      const found = ingredients.find(
                        (item) => normalizeName(item.name) === normalizeName(event.target.value)
                      )
                      setEntryForm((previous) => ({
                        ...previous,
                        ingredientId: found ? String(found.id) : '',
                        unit: found ? getPreferredUnit(found) : 'kg',
                      }))
                      setError('')
                    }}
                  />
                  <datalist id="inventory-ingredient-options">
                    {ingredients.map((item) => (
                      <option key={item.id} value={item.name} />
                    ))}
                  </datalist>
                </label>

                {selectedEntryIngredient() && (
                  <div className="inventory-entry-current-stock">
                    <span>Stock actual</span>
                    <strong>{getDisplayStock(selectedEntryIngredient()!)}</strong>
                  </div>
                )}

                <div className="inventory-form-grid">
                  <label>
                    Cantidad comprada
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={entryForm.quantity}
                      onChange={(event) =>
                        setEntryForm({ ...entryForm, quantity: event.target.value })
                      }
                      placeholder="Ej. 2"
                    />
                  </label>
                  <label>
                    Unidad
                    <select
                      value={entryForm.unit}
                      disabled={!selectedEntryIngredient()}
                      onChange={(event) =>
                        setEntryForm({ ...entryForm, unit: event.target.value as Unit })
                      }
                    >
                      {selectedEntryIngredient()
                        ? units[selectedEntryIngredient()!.measureType].map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))
                        : <option value="kg">Seleccioná ingrediente</option>}
                    </select>
                  </label>
                </div>

                <label>
                  Precio total pagado (ARS)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={entryForm.totalCost}
                    onChange={(event) =>
                      setEntryForm({ ...entryForm, totalCost: event.target.value })
                    }
                    placeholder="Ej. 5000"
                  />
                </label>

                <label>
                  Fecha de compra
                  <input
                    type="date"
                    value={entryForm.date}
                    onChange={(event) =>
                      setEntryForm({ ...entryForm, date: event.target.value })
                    }
                  />
                </label>

                {selectedEntryIngredient() && entryForm.quantity && (
                  <div className="inventory-entry-preview">
                    <span>Stock después de la entrada</span>
                    <strong>
                      {formatNumber(
                        selectedEntryIngredient()!.stock +
                        Number(entryForm.quantity) * factors[entryForm.unit]
                      )} {baseUnits[selectedEntryIngredient()!.measureType]}
                    </strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="inventory-form">
                <label>
                  Nombre del ingrediente
                  <input
                    value={form.name}
                    onChange={(event) => {
                      setForm({ ...form, name: event.target.value })
                      setDuplicate(null)
                    }}
                    placeholder="Ej. Harina 0000"
                    autoFocus
                  />
                </label>

                <label>
                  Categoría
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>

                {modal === 'new' && (
                  <>
                    <button
                      type="button"
                      className="inventory-category-toggle"
                      onClick={() => setShowNewCategory(!showNewCategory)}
                    >
                      + Crear una categoría nueva
                    </button>

                    {showNewCategory && (
                      <div className="inventory-new-category">
                        <input
                          value={newCategory}
                          onChange={(event) => setNewCategory(event.target.value)}
                          placeholder="Nombre de la nueva categoría"
                        />
                        <button type="button" onClick={handleAddCategory}>
                          Agregar
                        </button>
                      </div>
                    )}

                    <label>
                      Tipo de medida
                      <select
                        value={form.measureType}
                        onChange={(event) =>
                          handleMeasureTypeChange(event.target.value as MeasureType)
                        }
                      >
                        <option value="weight">Sólido (gramos)</option>
                        <option value="volume">Líquido (mililitros)</option>
                        <option value="count">Contable (unidades)</option>
                      </select>
                    </label>

                    <div className="inventory-form-grid">
                      <label>
                        Stock inicial
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={form.stock}
                          onChange={(event) =>
                            setForm({ ...form, stock: event.target.value })
                          }
                          placeholder="Ej. 2"
                        />
                      </label>
                      <label>
                        Unidad
                        <select
                          value={form.unit}
                          onChange={(event) =>
                            setForm({ ...form, unit: event.target.value as Unit })
                          }
                        >
                          {units[form.measureType].map((unit) => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label>
                      Precio total del stock inicial (ARS)
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={form.initialCost}
                        onChange={(event) =>
                          setForm({ ...form, initialCost: event.target.value })
                        }
                        placeholder="Ej. 4000"
                      />
                    </label>
                  </>
                )}

                <label>
                  Stock mínimo ({baseUnits[form.measureType]})
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.minStock}
                    onChange={(event) =>
                      setForm({ ...form, minStock: event.target.value })
                    }
                    placeholder="Ej. 1000"
                  />
                </label>

                {duplicate && (
                  <div className="inventory-duplicate-warning">
                    <strong>Este ingrediente ya existe</strong>
                    <p>
                      Encontramos <b>{duplicate.name}</b>.
                      Para reponerlo, utilizá «Registrar entrada».
                    </p>
                    <div className="inventory-duplicate-actions">
                      <button
                        type="button"
                        onClick={() => setDuplicate(null)}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={confirmDuplicateEntry}
                      >
                        Ir a registrar entrada
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && <p className="inventory-form-error">{error}</p>}

            <div className="inventory-modal-actions">
              <button
                className="inventory-cancel-button"
                onClick={() => setModal(null)}
              >
                Cancelar
              </button>
              <button
                className="inventory-primary-button"
                onClick={
                  modal === 'entry'
                    ? handleRegisterEntry
                    : handleSaveIngredient
                }
                disabled={duplicate !== null}
              >
                {modal === 'new'
                  ? 'Crear ingrediente'
                  : modal === 'entry'
                    ? 'Registrar entrada'
                    : 'Guardar cambios'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Inventory
