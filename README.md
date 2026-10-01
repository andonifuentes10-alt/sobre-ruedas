# Sobre Ruedas — Landing page

Landing page de conversión para el concesionario **Sobre Ruedas**.
Flujo: **me identifico → veo vehículos → elijo uno → solicito presupuesto → llamo al 908 368 294**.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura semántica, SEO, secciones y modales |
| `styles.css` | Diseño (negro/antracita + acento naranja `#FF5B04`), responsive y accesibilidad |
| `app.js` | Identificación, catálogo, filtros, selección de vehículo, presupuesto y analítica |

## Cómo verla

Abrir `index.html` en el navegador, o servir la carpeta en local:

```bash
npx serve .
```

## Añadir vehículos reales

Edita el array `vehicles` en `app.js`. Todo lo que quede en `null` se muestra como
`[INFORMACIÓN PENDIENTE]` — nunca se inventan datos.

```js
{
  id: "v-audi-a3",        // id único
  marca: "Audi",
  modelo: "A3",
  anio: 2021,
  combustible: "Gasolina",
  cambio: "Automático",
  km: 68000,
  potencia: "150 CV",
  tipo: "Turismo",
  precio: null,           // null = pendiente
  estado: null,           // ej. "Disponible"
  imagen: "img/vehiculos/audi-a3.webp",
  alt: "Audi A3 en Sobre Ruedas"
}
```

Al haber datos reales, los filtros (marca, combustible, cambio, año, tipo) se muestran
automáticamente y se activan. La tarjeta incluye su propio botón **Solicitar presupuesto**
y el sistema recuerda el vehículo seleccionado.

## Puntos de integración pendientes

- **CRM / leads**: en `app.js`, dentro del `setTimeout` del envío del formulario de
  identificación (marcado como *punto de integración futuro*). No incluir claves en el frontend.
- **Analítica**: los eventos se envían a `window.dataLayer` (`page_view`,
  `identification_form_*`, `vehicle_view`, `vehicle_select`, `cta_*`, `phone_click`,
  `scroll_50`, `scroll_90`). No hay ningún servicio externo conectado.
- **Dominio / canonical / Open Graph**: actualizar `https://www.sobreruedas.es/` en `index.html`.
- **Textos legales**: completar Política de Privacidad, Cookies y Condiciones (marcados como pendientes).
- **Datos empresariales**: dirección, email y CIF → `[DATOS EMPRESARIALES PENDIENTES]` en el footer.

## Contacto

- Teléfono: **908 368 294** → enlaces `tel:908368294` en toda la web.
