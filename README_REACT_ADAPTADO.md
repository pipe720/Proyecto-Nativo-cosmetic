# Nativo Cosmetic - version React adaptada

## Estructura

- `Backend/`: API Express y modelos MongoDB existentes.
- `nativocosmetic/`: aplicacion React Create React App.

## Rutas React

- `/`: tienda publica convertida a React.
- `/pago`: checkout/pago seguro convertido a React.
- `/admin`: panel administrativo existente.
- `/admin/nuevo-producto`: creacion de productos.
- `/admin/stock`: gestion de stock.

## Ejecutar

1. Instalar backend:

```bash
cd Backend
npm install
npm run seed:productos
npm start
```

El comando `npm run seed:productos` carga el catalogo inicial en MongoDB usando la coleccion `productos`. Es seguro ejecutarlo mas de una vez: actualiza por `idproducto` y evita duplicados.

2. Instalar frontend React:

```bash
cd nativocosmetic
npm install
npm start
```

La tienda React usa `http://localhost:3900` como API por defecto. Si necesitas cambiarlo, crea un archivo `.env` dentro de `nativocosmetic/`:

```bash
REACT_APP_API_URL=http://localhost:3900
```

La tienda publica obtiene sus productos desde `GET /api/productos`. Si la base de datos esta vacia o el backend no esta levantado, React mostrara un aviso en vez de usar productos hardcodeados.

## Verificacion realizada

```bash
cd nativocosmetic
npm run build
npm test -- --watchAll=false
```

Ambos comandos compilan y pasan correctamente.
