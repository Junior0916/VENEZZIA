/**
 * Culqi Checkout v4 Integration Service
 */

function getPocketBaseUrl() {
  const envUrl = import.meta.env.VITE_POCKETBASE_URL
  const isBrowser = typeof window !== 'undefined'
  const isLocalHost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  if (isBrowser && !isLocalHost) {
    return 'https://admin.venezzia.shop'
  }

  if (envUrl && (!envUrl.includes('127.0.0.1') || isLocalHost)) {
    return envUrl
  }

  return 'http://127.0.0.1:8090'
}

export async function getCulqiPublicKey() {
  if (typeof window !== 'undefined') {
    if (window.CULQI_PUBLIC_KEY && window.CULQI_PUBLIC_KEY.startsWith('pk_')) return window.CULQI_PUBLIC_KEY
    const stored = localStorage.getItem('culqi_public_key')
    if (stored && stored.startsWith('pk_')) return stored
  }

  // Check from backend /api/culqi/config
  try {
    const backendUrl = getPocketBaseUrl()
    const res = await fetch(`${backendUrl}/api/culqi/config`)
    if (res.ok) {
      const data = await res.json()
      if (data.publicKey && data.publicKey.startsWith('pk_')) {
        return data.publicKey
      }
    }
  } catch (e) {}

  const envKey = import.meta.env.VITE_CULQI_PUBLIC_KEY
  if (envKey && envKey.startsWith('pk_') && envKey !== 'pk_test_sample_key_here') {
    return envKey
  }

  return null
}

let culqiScriptLoaded = false

export function loadCulqiScript() {
  return new Promise((resolve, reject) => {
    if (culqiScriptLoaded || window.Culqi) {
      resolve(window.Culqi)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.culqi.com/js/v4'
    script.async = true
    script.onload = () => {
      culqiScriptLoaded = true
      resolve(window.Culqi)
    }
    script.onerror = () => reject(new Error('No se pudo cargar la pasarela de pagos Culqi.'))
    document.head.appendChild(script)
  })
}

/**
 * Configure and launch Culqi Checkout Modal
 * @param {Object} options
 * @param {string} options.title - Título mostrado en la pasarela
 * @param {string} options.currency - Código de moneda (PEN o USD)
 * @param {number} options.amount - Monto en céntimos (ej: 50.00 PEN -> 5000)
 * @param {string} options.description - Descripción de la compra
 * @param {Function} options.onToken - Callback ejecutado cuando el usuario completa el pago y se genera el token
 * @param {Function} options.onError - Callback ejecutado en caso de error
 */
export async function openCulqiCheckout({
  title = 'Compra en Línea',
  currency = 'PEN',
  amount,
  description = 'Pago de productos',
  onToken,
  onError
}) {
  try {
    await loadCulqiScript()

    if (!window.Culqi) {
      throw new Error('Culqi no está disponible en la ventana global.')
    }

    const pubKey = await getCulqiPublicKey()
    if (!pubKey) {
      const userKey = prompt(
        'Ingresa tu Llave Pública de prueba de Culqi (ej: pk_test_...):'
      )
      if (userKey && userKey.trim().startsWith('pk_')) {
        localStorage.setItem('culqi_public_key', userKey.trim())
        window.Culqi.publicKey = userKey.trim()
      } else {
        throw new Error('Debes ingresar tu Llave Pública de Culqi (pk_test_...) para iniciar la pasarela de pagos.')
      }
    } else {
      window.Culqi.publicKey = pubKey
    }

    window.Culqi.settings({
      title: title,
      currency: currency,
      amount: Math.round(amount)
    })

    window.Culqi.options({
      lang: 'auto',
      installments: false,
      paymentMethods: {
        tarjeta: true,
        yape: true,
        billetera: true,
        bancaMovil: true,
        agente: true,
        cuotealo: false
      }
    })

    // Callback global de Culqi
    window.culqi = async function () {
      if (window.Culqi.token) {
        const token = window.Culqi.token
        window.Culqi.close()
        if (onToken) {
          onToken(token)
        }
      } else if (window.Culqi.order) {
        // En caso de pagos con banca móvil / agentes (CIP)
        const order = window.Culqi.order
        window.Culqi.close()
        if (onToken) {
          onToken({ id: order.id, type: 'order', details: order })
        }
      } else {
        const error = window.Culqi.error
        if (onError) {
          onError(error)
        } else {
          console.error('[Culqi Error]', error)
          alert(error?.user_message || 'Hubo un error con la pasarela de pagos.')
        }
      }
    }

    window.Culqi.open()
  } catch (err) {
    console.error('Error al iniciar Culqi:', err)
    if (onError) onError(err)
  }
}

/**
 * Send the generated token to our PocketBase backend to finalize the charge
 */
export async function sendChargeToBackend({ token, email, amount, orderInfo }) {
  const backendUrl = getPocketBaseUrl()
  const response = await fetch(`${backendUrl}/api/culqi/charge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: token.id || token,
      email: email,
      amount: amount,
      orderInfo: orderInfo
    })
  })

  let result = {}
  try {
    result = await response.json()
  } catch (e) {
    throw new Error('Respuesta no válida del servidor de pagos.')
  }

  if (!response.ok) {
    throw new Error(result.error || result.message || 'Error al procesar el pago con el servidor.')
  }

  return result
}
