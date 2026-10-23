/**
 * Culqi Checkout v4 Integration Service
 */

const CULQI_PUBLIC_KEY = import.meta.env.VITE_CULQI_PUBLIC_KEY || 'pk_test_placeholder'
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

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

    window.Culqi.publicKey = CULQI_PUBLIC_KEY

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
  const response = await fetch(`${POCKETBASE_URL}/api/culqi/charge`, {
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

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Error al procesar el pago con el servidor.')
  }

  return result
}
