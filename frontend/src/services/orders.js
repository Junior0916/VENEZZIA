import { POCKETBASE_URL } from './pocketbase'

/**
 * Servicio para consultar y gestionar pedidos de Venezzia Detalles
 */
export async function fetchOrders(filters = {}) {
  const query = new URLSearchParams()
  if (filters.status) query.append('status', filters.status)
  if (filters.search) query.append('search', filters.search)
  if (filters.startDate) query.append('startDate', filters.startDate)
  if (filters.endDate) query.append('endDate', filters.endDate)

  const url = `${POCKETBASE_URL}/api/venezzia/orders${query.toString() ? '?' + query.toString() : ''}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error al obtener pedidos (${response.status})`)
  }

  return await response.json()
}

/**
 * Guarda un pedido nuevo (WhatsApp, Culqi o manual)
 */
export async function createOrder(orderData) {
  const url = `${POCKETBASE_URL}/api/venezzia/orders`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error al guardar pedido (${response.status})`)
  }

  return await response.json()
}

/**
 * Actualiza un pedido existente (adelanto, costo delivery, estado, notas, etc.)
 */
export async function updateOrder(updateData) {
  const url = `${POCKETBASE_URL}/api/venezzia/orders/update`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error al actualizar pedido (${response.status})`)
  }

  return await response.json()
}

/**
 * Elimina un pedido:
 * permanent = false -> Oculta / archiva el pedido (soft-delete, conservando el prospecto)
 * permanent = true  -> Elimina el registro por completo de la base de datos
 */
export async function deleteOrder(id, permanent = false) {
  const url = `${POCKETBASE_URL}/api/venezzia/orders/delete`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, permanent })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error al eliminar pedido (${response.status})`)
  }

  return await response.json()
}
