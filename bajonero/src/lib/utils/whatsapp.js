export const buildWhatsAppMessage = (items, notes, businessName = 'Bajonero Burger') => {
  const lines = items.map(
    (item) => `• ${item.quantity}x ${item.name} — $${(item.price * item.quantity).toLocaleString('es-AR')}`
  )
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  let msg = `🍔 *PEDIDO — ${businessName}*\n\n`
  msg += `*Productos:*\n${lines.join('\n')}\n\n`
  if (notes.trim()) msg += `*Aclaraciones:*\n${notes.trim()}\n\n`
  msg += `💰 *Total: $${total.toLocaleString('es-AR')}*\n\n`
  msg += `¡Muchas gracias! 🙌`
  return msg
}

export const openWhatsApp = (phone, items, notes, businessName) => {
  const msg = buildWhatsAppMessage(items, notes, businessName)
  const number = phone.replace(/\D/g, '')
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank')
}
