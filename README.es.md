# ng-hub-ui-stepper

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-stepper.svg)](https://www.npmjs.com/package/ng-hub-ui-stepper)
[![license](https://img.shields.io/npm/l/ng-hub-ui-stepper.svg)](https://github.com/carlos-morcillo/ng-hub-ui-stepper/blob/main/LICENSE)

Un componente de stepper (pasos) flexible, personalizable y accesible para Angular 21+. Ideal para formularios de varios pasos, asistentes y experiencias de usuario guiadas, con un enfoque en la experiencia del desarrollador y los estándares modernos.

> [!IMPORTANT]
> Esta versión (21.2.0) está construida para **Angular 21** y utiliza la nueva arquitectura de **Signals**.

## 🧩 Familia de Librerías `ng-hub-ui`

Esta librería forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso (Inicio Rápido)](#uso-inicio-rápido)
- [Ejemplos](#ejemplos)
	- [Stepper Lineal](#stepper-lineal)
	- [Navegación Personalizada](#navegación-personalizada)
	- [Botones Personalizados](#botones-personalizados)
- [Referencia de la API](#referencia-de-la-api)
	- [StepperComponent](#steppercomponent)
	- [StepComponent](#stepcomponent)
	- [Directivas](#directivas)
	- [Interfaces](#interfaces)
- [Estilos](#estilos)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

- 🚀 **Angular 21+ Built-in**: Utiliza Signals y la nueva sintaxis de control de flujo.
- 🎨 **Altamente Personalizable**: Fácil de tematizar mediante variables CSS y plantillas personalizadas.
- ♿ **Accesible**: Roles ARIA adecuados y navegación por teclado.
- 🔢 **Multi-layout**: Soporta modos Vertical, Lateral (Sidebar) y RTL.
- 🔄 **Transiciones Suaves**: Animaciones CSS integradas.
- 🧩 **Controles Flexibles**: Usa botones por defecto o proyecta los tuyos propios.

## Instalación

```bash
npm install ng-hub-ui-stepper
```

## Uso (Inicio Rápido)

Importa `StepperModule` en tu módulo o componente:

```typescript
import { StepperModule } from 'ng-hub-ui-stepper';

@Component({
  standalone: true,
  imports: [StepperModule],
  // ...
})
export class TuComponente { }
```

En tu plantilla:

```html
<hub-stepper>
  <hub-step title="Configuración de Cuenta">
    <h3>¡Bienvenido!</h3>
    <p>Configura los detalles de tu cuenta aquí.</p>
  </hub-step>

  <hub-step title="Información Personal">
    <h3>Datos del Perfil</h3>
    <p>Cuéntanos más sobre ti.</p>
  </hub-step>

  <hub-step title="Revisión">
    <h3>Guardar y Finalizar</h3>
    <p>¿Todo listo para empezar?</p>
  </hub-step>
</hub-stepper>
```

## Ejemplos

### Stepper Lineal

Controla la navegación habilitando o deshabilitando pasos programáticamente.

```html
<hub-stepper (completed)="onFinish()">
  <hub-step title="Paso 1">
    <!-- Contenido Paso 1 -->
  </hub-step>

  <hub-step title="Paso 2" [disabled]="!esPaso1Valido()">
    <!-- Contenido Paso 2 -->
  </hub-step>
</hub-stepper>
```

### Navegación Personalizada

Proporciona tu propia plantilla de navegación usando la propiedad `stepperNavTpt`.

```html
<hub-stepper>
  <nav *stepperNav="let steps = steps; let currentIndex = currentIndex" class="mi-navegacion-personalizada">
     @for (step of steps; track step; let i = $index) {
       <button
         [class.active]="i === currentIndex"
         (click)="goTo(i)">
         {{ step.title() }}
       </button>
     }
  </nav>

  <hub-step title="A">...</hub-step>
  <hub-step title="B">...</hub-step>
</hub-stepper>
```

### Botones Personalizados

Proyecta tus propios botones para sobrescribir el pie de página por defecto.

```html
<hub-stepper>
  <hub-step>...</hub-step>

  <button previousButton class="btn-back">Atrás</button>
  <button nextButton class="btn-next">Siguiente</button>
  <button submitButton class="btn-done">Completar</button>
</hub-stepper>
```

## Referencia de la API

### StepperComponent (`hub-stepper`)

| Entrada | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `backLabel` | `string` | `'Back'` | Etiqueta para el botón de retroceso. |
| `continueLabel` | `string` | `'Continue'` | Etiqueta para el botón de continuar. |
| `submitLabel` | `string` | `'Submit'` | Etiqueta para el botón de envío final. |
| `options` | `StepperOptions` | `{}` | Configuración visual y de diseño. |

| Salida | Tipo | Descripción |
|---|---|---|
| `completed` | `EventEmitter<void>` | Se emite cuando se completa el último paso. |
| `previousStep` | `EventEmitter<number>` | Se emite al retroceder. Pasa el nuevo índice. |
| `nextStep` | `EventEmitter<number>` | Se emite al avanzar. Pasa el nuevo índice. |

### StepComponent (`hub-step`)

| Entrada | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `title` | `string` | `optional` | Texto mostrado en la navegación. |
| `disabled` | `boolean` | `false` | Evita la navegación a este paso. |

### Directivas

- `nextButton`: Aplícala a cualquier botón para usarlo como control "siguiente".
- `previousButton`: Aplícala a cualquier botón para usarlo como control "atrás".
- `submitButton`: Aplícala a cualquier botón para usarlo como control de "finalizar".
- `stepperNav`: Marca una plantilla para ser usada como navegación personalizada.

### Interfaces

#### `StepperOptions`
```typescript
interface StepperOptions {
  layout?: 'vertical' | 'sidebar';
  rtl?: boolean;
}
```

## Estilos

Personaliza el componente usando variables CSS. Para una lista completa de los tokens disponibles, consulta la [Referencia de Variables CSS](docs/css-variables-reference.md).

```css
.mi-stepper {
  --hub-stepper-primary-color: #009ef7;
  --hub-stepper-surface-color: #ffffff;
  --hub-stepper-gap: 1.5rem;
}
```

## Contribución

¡Agradecemos todas las contribuciones! Por favor, sigue nuestras [Guías de Commit](https://github.com/carlos-morcillo/ng-hub-ui/blob/main/CONTRIBUTING.md).

1. Haz un Fork del repositorio.
2. Crea tu rama de característica (`git checkout -b feature/nueva-caracteristica`).
3. Haz commit de tus cambios.
4. Empuja la rama.
5. Crea un Pull Request.

## Soporte

Si encuentras útil este proyecto, considera apoyar su desarrollo:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

## Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.
