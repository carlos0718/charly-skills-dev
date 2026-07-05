# Development Methodologies

Este archivo documenta las metodologías de desarrollo que usa la skill `/new-project` al crear proyectos. Cada proyecto generado aplica **SDD** para definir el alcance, **DDD** para modelar el dominio (proyectos con backend/DB), **TDD** durante el desarrollo de cada feature, y **BDD** para documentar comportamientos en iteraciones futuras.

---

## Specification-Driven Development (SDD)

**Cuándo:** Antes de escribir cualquier línea de código.

SDD establece que toda feature debe tener una spec antes de ser implementada. El código existe para satisfacer la spec, no al revés.

### En la práctica

Al crear un proyecto con `/new-project`, se genera un `SPEC.md` en la raíz que define:
- El objetivo del proyecto en 2-3 líneas
- Las features del MVP ordenadas por prioridad (P0/P1/P2)
- User stories clave
- Modelos de datos y API contracts (si aplica)
- Criterios de aceptación del MVP
- Qué queda **fuera** del alcance v1 (evitar scope creep)

### Flujo SDD

```
Descripción del proyecto
        ↓
    SPEC.md aprobado
        ↓
   Diseño del sistema (stack, arquitectura, design system)
        ↓
   Implementación (el código satisface el spec)
        ↓
   Criterios de aceptación verificados
```

### Mantener el spec actualizado

Cada vez que se agrega una feature nueva o se cambia el alcance:
1. Actualizar `SPEC.md` primero
2. Mover features completadas a la sección ✅
3. Documentar qué quedó fuera de alcance y por qué

---

## Test-Driven Development (TDD)

**Cuándo:** Durante el desarrollo de cada feature.

TDD garantiza que el código hace exactamente lo que el spec dice, y que los cambios futuros no rompen funcionalidad existente.

### Ciclo Red → Green → Refactor

```
1. RED    → Escribir un test que falla para la funcionalidad a implementar
2. GREEN  → Escribir el mínimo código necesario para que el test pase
3. REFACTOR → Mejorar el código sin romper los tests
```

### En la práctica

```typescript
// 1. RED — el test falla porque la función no existe todavía
it("should calculate total with tax", () => {
  expect(calculateTotal(100, 0.21)).toBe(121);
});

// 2. GREEN — implementación mínima
function calculateTotal(amount: number, tax: number): number {
  return amount + amount * tax;
}

// 3. REFACTOR — mejorar sin romper
function calculateTotal(amount: number, taxRate: number): number {
  return parseFloat((amount * (1 + taxRate)).toFixed(2));
}
```

### Comandos del proyecto

```bash
npm test              # corre todos los tests
npm test -- --watch   # modo watch (ideal para TDD activo)
npm run test:coverage # coverage report
```

### Qué testear con TDD

- Funciones de negocio puras (cálculos, transformaciones, validaciones)
- Handlers de API (request → response)
- Componentes con lógica compleja
- Casos edge: null, undefined, strings vacíos, arrays vacíos, números negativos

### Qué NO necesita TDD estricto

- Componentes puramente visuales sin lógica
- Configuración de herramientas (tailwind.config, vite.config)
- Migraciones de base de datos

---

## Behavior-Driven Development (BDD)

**Cuándo:** Para definir y documentar el comportamiento de features nuevas, especialmente en iteraciones futuras del proyecto.

BDD conecta el lenguaje de negocio con los tests técnicos usando Given/When/Then, haciendo que los criterios de aceptación sean directamente ejecutables.

### Sintaxis Gherkin

```gherkin
Feature: [nombre de la feature]

  Scenario: [caso de uso específico]
    Given [el estado inicial del sistema]
    When  [la acción que realiza el usuario]
    And   [acción adicional si necesario]
    Then  [el resultado esperado]
    And   [resultado adicional si necesario]
```

### Ejemplo real

```gherkin
Feature: Autenticación de usuarios

  Scenario: Login exitoso con credenciales válidas
    Given el usuario está en la página de login
    When ingresa el email "user@example.com" y la contraseña correcta
    And hace click en "Ingresar"
    Then es redirigido al dashboard
    And ve su nombre en el header

  Scenario: Credenciales incorrectas
    Given el usuario está en la página de login
    When ingresa una contraseña incorrecta
    Then ve el mensaje "Email o contraseña incorrectos"
    And permanece en la página de login
    And el campo de contraseña se limpia

  Scenario: Intentos fallidos repetidos
    Given el usuario falló el login 3 veces consecutivas
    When intenta ingresar de nuevo
    Then ve el mensaje "Cuenta bloqueada temporalmente"
    And recibe un email de recuperación
```

### BDD con Vitest (sin Cucumber)

Si no querés instalar Cucumber, podés escribir BDD-style en Vitest:

```typescript
describe("Feature: User Authentication", () => {
  describe("Scenario: Successful login with valid credentials", () => {
    it("Given user is on login page, When they enter valid credentials, Then they are redirected to dashboard", async () => {
      // arrange
      renderLoginPage();
      // act
      await userEvent.type(screen.getByLabelText("Email"), "user@example.com");
      await userEvent.type(screen.getByLabelText("Password"), "validPass123");
      await userEvent.click(screen.getByRole("button", { name: "Ingresar" }));
      // assert
      expect(window.location.pathname).toBe("/dashboard");
    });
  });
});
```

### BDD con Playwright (E2E)

```typescript
test.describe("Feature: Checkout flow", () => {
  test("Scenario: Complete purchase with valid card", async ({ page }) => {
    // Given
    await page.goto("/cart");
    await expect(page.getByText("2 items")).toBeVisible();
    // When
    await page.getByRole("button", { name: "Proceed to checkout" }).click();
    await page.getByLabel("Card number").fill("4242 4242 4242 4242");
    await page.getByRole("button", { name: "Pay now" }).click();
    // Then
    await expect(page.getByText("Order confirmed")).toBeVisible();
  });
});
```

### Cómo usar BDD en iteraciones futuras

Antes de implementar una feature nueva en este proyecto:

1. **Escribir los scenarios BDD** en lenguaje natural (con el equipo o el cliente si aplica)
2. **Convertirlos en tests** (Playwright para E2E, Vitest para unitarios)
3. **Confirmar que los tests fallan** (Red)
4. **Implementar la feature** hasta que los tests pasen (Green)
5. **Refactorizar** sin romper los tests

Los scenarios BDD también sirven como documentación viva — cualquiera puede leer `login.feature` y entender exactamente cómo funciona el login sin leer el código.

---

---

## Domain-Driven Design (DDD)

**Cuándo:** Junto con SDD, antes de codear. Solo para proyectos con lógica de negocio y persistencia (fullstack, backend, API). Para frontend puro o scripts: omitir.

DDD propone pensar el software desde las **entidades y reglas del negocio** hacia afuera, en vez de arrancar desde la interfaz o desde la tecnología. La idea central: el código debe hablar el mismo idioma que el negocio (ubiquitous language).

### Por qué importa el orden

En un proyecto fullstack, todo se deriva del dominio:

```
Entidades del dominio (qué existe en el negocio)
        ↓
Schema de DB (cómo se persisten esas entidades)
        ↓
Repositorios (cómo se accede a los datos — abstracción)
        ↓
Servicios / lógica de negocio (las reglas que operan sobre las entidades)
        ↓
API / endpoints (cómo el mundo exterior accede a los servicios)
        ↓
Frontend / UI (cómo el usuario interactúa con la API)
```

Si arrancás al revés (primero los componentes, después ves qué datos necesitan), terminás con una DB que sigue la forma de tu UI en vez de la forma de tu negocio — y eso genera deuda técnica difícil de corregir.

### Conceptos clave de DDD aplicados

| Concepto | Qué es | Ejemplo |
|---|---|---|
| **Entity** | Objeto con identidad propia que persiste | `User`, `Order`, `Product` |
| **Value Object** | Dato inmutable sin identidad propia | `Money`, `Address`, `Email` |
| **Aggregate** | Grupo de entidades que se tratan como unidad | `Order` + `OrderItems` |
| **Repository** | Abstracción del acceso a datos | `OrderRepository.findById()` |
| **Service** | Lógica que no pertenece a ninguna entidad | `PaymentService.charge()` |
| **Ubiquitous Language** | Nombres del dominio que se usan igual en el código y en las conversaciones | Si el negocio dice "Pedido", el código dice `Order` — no `Cart`, no `Transaction` |

### Flujo de análisis de dominio en P1.7

Antes de generar el SPEC.md, la skill hace 3 preguntas para extraer el modelo de dominio:

1. **¿Cuáles son las entidades principales?** → `User`, `Product`, `Order`, `Post`, etc.
2. **¿Cómo se relacionan?** → "un User tiene muchos Orders", "un Order tiene muchos Products"
3. **¿Cuáles son las reglas de negocio críticas?** → "el stock no puede ser negativo", "solo admins pueden publicar"

Con esas respuestas se genera el diagrama de entidades y el schema de DB inferido, que quedan en el SPEC.md como punto de partida.

### Estructura de carpetas que refleja DDD

Para proyectos donde DDD aplica, la arquitectura de P4 separa las capas:

```
src/
  domain/              # entidades, value objects, interfaces de repositorio
    entities/
      User.ts
      Order.ts
    repositories/
      UserRepository.ts     ← interface (contrato)
      OrderRepository.ts
  application/         # servicios con lógica de negocio
    UserService.ts
    OrderService.ts
  infrastructure/      # implementaciones concretas (DB, HTTP, etc.)
    persistence/
      UserRepositoryImpl.ts  ← implementación real con Prisma/Drizzle
      OrderRepositoryImpl.ts
    http/
      routes/
  presentation/        # controllers, handlers, response mappers
    api/
      userController.ts
```

### DDD + TDD — la combinación ideal

Una vez definido el dominio:
1. Los **repositorios son interfaces** → se pueden mockear fácilmente en tests
2. Los **servicios reciben interfaces** → la lógica de negocio es testeable sin DB
3. Los tests de dominio son los más rápidos y los más estables

```typescript
// domain/repositories/OrderRepository.ts
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

// application/OrderService.ts
export class OrderService {
  constructor(private repo: OrderRepository) {}

  async placeOrder(userId: string, items: OrderItem[]): Promise<Order> {
    // lógica de negocio pura, sin imports de Prisma ni DB
  }
}

// tests/OrderService.test.ts
const mockRepo: OrderRepository = {
  findById: vi.fn(),
  save: vi.fn(),
};
const service = new OrderService(mockRepo);
// → test rápido, sin DB, sin red
```

---

## Resumen — cuándo usar cada una

| Metodología | Momento                          | Artefacto                            | ¿Aplica a qué proyectos?          |
|-------------|----------------------------------|--------------------------------------|-----------------------------------|
| SDD         | Antes de codear                  | `SPEC.md`                            | Todos                             |
| DDD         | Junto con SDD (análisis previo)  | Diagrama de entidades + schema de DB | Fullstack, backend, API           |
| TDD         | Durante el desarrollo            | Tests unitarios / integración        | Todos con lógica testeable        |
| BDD         | Iteraciones futuras              | Scenarios Gherkin / E2E tests        | Todos con flujos de usuario       |
