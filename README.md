# 🛒 OnePage Ecommerce (Vue 3 + PocketBase + Culqi)

Un ecommerce ligero, administrable y rápido para Perú, diseñado para gestionar fácilmente productos y precios mediante **PocketBase** y procesar pagos mediante **Culqi**.

---

## 🏗️ Estructura del Proyecto

```text
Ecommerce/
├── backend/                  # Servidor PocketBase autoadministrable
│   ├── pocketbase.exe        # Binario de PocketBase
│   ├── pb_hooks/
│   │   ├── culqi.pb.js       # Hook seguro para procesar cobros con Culqi (POST /api/culqi/charge)
│   │   └── init_collections.pb.js
│   ├── pb_schema.json        # Esquema preconfigurado para importar colecciones (products y orders)
│   └── .env                  # CULQI_SECRET_KEY
├── frontend/                 # Aplicación OnePage en Vue 3
│   ├── src/
│   │   ├── components/       # Navbar, Hero, ProductGrid, ProductCard, Features, CartDrawer, Footer
│   │   ├── services/         # Clientes de PocketBase y pasarela Culqi v4
│   │   ├── stores/           # Carrito reactivo con Pinia y persistencia LocalStorage
│   │   └── App.vue
│   └── .env                  # VITE_POCKETBASE_URL y VITE_CULQI_PUBLIC_KEY
├── start-dev.bat             # Script para iniciar backend y frontend en un solo clic
└── README.md
```

---

## ⚡ Inicio Rápido

### Opción 1: Con el lanzador automático (Windows)
Haz doble clic sobre `start-dev.bat`. Se abrirán automáticamente dos consolas:
- **Backend (PocketBase)** en `http://127.0.0.1:8090`
- **Frontend (Vue 3)** en `http://localhost:5173`

### Opción 2: Manual por consola

1. **Iniciar PocketBase:**
   ```powershell
   cd backend
   .\pocketbase.exe serve
   ```
   - Panel de Administración: [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)
   *(La primera vez que entres te pedirá crear un correo y contraseña de superusuario/administrador).*

2. **Iniciar Vue 3:**
   ```powershell
   cd frontend
   npm run dev
   ```
   - Aplicación web: [http://localhost:5173](http://localhost:5173)

---

## 📦 Configuración del CMS (PocketBase)

1. Ingresa a `http://127.0.0.1:8090/_/`
2. Ve a **Settings -> Import collections** y carga el archivo `backend/pb_schema.json`.
3. Esto creará automáticamente:
   - **`products`**: Campos para `name`, `description`, `price`, `compare_at_price`, `category`, `image`, `featured`, `in_stock`.
   - **`orders`**: Registro de compras realizadas con Culqi (`customer_name`, `email`, `phone`, `items`, `total`, `culqi_charge_id`).
4. Si aún no hay productos cargados en PocketBase, el frontend mostrará automáticamente productos de demostración para que la página siempre tenga contenido visual atractivo.

---

## 💳 Configuración de Culqi (Perú)

1. **Frontend (`frontend/.env`)**:
   ```env
   VITE_POCKETBASE_URL=http://127.0.0.1:8090
   VITE_CULQI_PUBLIC_KEY=pk_test_tu_llave_publica
   ```

2. **Backend (`backend/.env`)**:
   ```env
   CULQI_SECRET_KEY=sk_test_tu_llave_secreta
   ```

3. El frontend utiliza el checkout oficial de Culqi v4 y envía el token seguro al hook de PocketBase (`POST /api/culqi/charge`), garantizando que la llave secreta nunca quede expuesta en el navegador del cliente.
