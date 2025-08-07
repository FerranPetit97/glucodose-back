# 🏗️ NestJS Clean Architecture Structure Explained

## **📁 Folder Structure Mapping**

```
src/modules/food-categories/
├── 📂 domain/                    # 🏢 DOMAIN LAYER (Core Business Logic)
│   ├── entities/                 # → Domain Models/Entities
│   └── repositories/             # → Repository Interfaces (contracts only)
│
├── 📂 application/               # 💼 APPLICATION LAYER (Use Cases/Services)
│   ├── dtos/                     # → Data Transfer Objects
│   └── use-cases/                # → Services/Business Logic
│
└── 📂 infrastructure/            # 🔧 INFRASTRUCTURE LAYER (External Concerns)
    └── adapters/
        ├── in/                   # → Controllers (HTTP Handlers/Routes)
        │   └── controllers/      # → NestJS Controllers
        └── out/                  # → Database Access
            └── orm/              # → Repository Implementations
```

## **🔄 Flow & Responsibilities**

### **1. Controllers (Handlers/Routes)**

📍 **Location**: `infrastructure/adapters/in/controllers/`

```typescript
@Controller('food-categories') // ← HTTP Route definition
export class FoodCategoriesController {
  constructor(
    private readonly createFoodCategoriesUseCase: CreateFoodCategoriesUseCase, // ← Injects Service
  ) {}

  @Post() // ← HTTP Handler
  async createFoodCategories(@Body() dto: CreateFoodCategoriesDto) {
    const created = await this.createFoodCategoriesUseCase.execute(dto); // ← Calls Service
    return ResponseFoodCategoriesDto.fromDomain(created); // ← Returns response
  }
}
```

**Role**: HTTP request/response handling, routing, calling services

### **2. Use Cases (Services)**

📍 **Location**: `application/use-cases/`

```typescript
@Injectable()
export class CreateFoodCategoriesUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly repository: FoodCategoriesRepository, // ← Injects Repository
  ) {}

  async execute(dto: CreateFoodCategoriesDto): Promise<FoodCategories> {
    // ✅ Business logic, validation, orchestration
    const category = FoodCategories.create(dto.name, dto.description);
    return await this.repository.save(category); // ← Calls Repository
  }
}
```

**Role**: Business logic, validation, orchestration between domain and infrastructure

### **3. Domain Entities (Domain Models)**

📍 **Location**: `domain/entities/`

```typescript
export class FoodCategories {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly description: string,
  ) {}

  static create(name: string, description: string): FoodCategories {
    return new FoodCategories(undefined, name, description);
  }

  // ✅ Pure business behavior, no external dependencies
  public isNew(): boolean {
    return this.id === undefined;
  }
}
```

**Role**: Pure business models with behavior, no external dependencies

### **4. Repository Interface (Contract)**

📍 **Location**: `domain/repositories/`

```typescript
export interface FoodCategoriesRepository {
  findById(id: string): Promise<FoodCategories | null>;
  save(category: FoodCategories): Promise<FoodCategories>;
  // ✅ Defines what the domain needs, not how it's implemented
}
```

**Role**: Defines data access contracts (what, not how)

### **5. Repository Implementation (Database Contact)**

📍 **Location**: `infrastructure/adapters/out/orm/repositories/`

```typescript
@Injectable()
export class FoodCategoriesOrmRepository implements FoodCategoriesRepository {
  constructor(private readonly em: EntityManager) {} // ← Database connection

  async save(category: FoodCategories): Promise<FoodCategories> {
    // ✅ Actual database operations
    const ormEntity = FoodCategoriesOrmEntity.fromDomain(category);
    this.em.persist(ormEntity);
    await this.em.flush();
    return ormEntity.toDomain();
  }
}
```

**Role**: Actual database operations, ORM handling

## **🔗 Dependency Flow**

```
📡 HTTP Request
     ↓
🎯 Controller (Handler)
     ↓ calls
💼 Use Case (Service)
     ↓ uses
🏢 Domain Entity + Repository Interface
     ↓ implemented by
🔧 Repository Implementation (DB Contact)
     ↓
🗄️ Database
```

## **📋 Summary**

| Layer                       | NestJS Term     | Clean Architecture Term | Responsibility                |
| --------------------------- | --------------- | ----------------------- | ----------------------------- |
| `controllers/`              | Controller      | Interface Adapter       | HTTP handlers, routing        |
| `use-cases/`                | Service         | Application Service     | Business logic, orchestration |
| `entities/`                 | Entity          | Domain Entity           | Business models, rules        |
| `repositories/` (interface) | Repository      | Domain Service          | Data access contract          |
| `orm/repositories/`         | Repository Impl | Infrastructure          | Database contact              |

**Key Points**:

- **Controllers** = HTTP handlers/routes
- **Use Cases** = Services (business logic)
- **Domain** = Pure business models
- **Repository Implementation** = Database contact
- **Repository Interface** = Contract between domain and infrastructure
