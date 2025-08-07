# 🛡️ Robust Error Handling Architecture

## **🎯 Overview**

This document explains our **robust error handling system** that follows **Clean Architecture** principles with clear separation of concerns across all layers.

## **✅ Architecture Principles**

### **Clear Separation of Concerns**

```
🌐 HTTP Layer (Controllers/Handlers)
├── ✅ Validate HTTP data (DTOs, ValidationPipes)
├── ✅ Handle HTTP requests/responses
├── ✅ Transform domain responses to HTTP format
└── ✅ Let Global Filter handle errors automatically

💼 Application Layer (Services/Use Cases)
├── ✅ Check business existence rules
├── ✅ Throw custom domain errors with specific codes
├── ✅ Orchestrate business operations
└── ✅ Business validation logic

🏢 Domain Layer (Entities)
├── ✅ Pure business models
├── ✅ Core domain rules
└── ✅ No external dependencies

🔧 Infrastructure Layer (Repositories)
├── ✅ Only database contact/operations
├── ✅ Convert between domain and ORM entities
└── ✅ Handle technical database errors
```

## **🔄 Error Flow Architecture**

### **1. Controller Layer (HTTP Handlers)**

```typescript
@Controller('food-categories')
export class FoodCategoriesController {
  @Post()
  async createFoodCategories(@Body() dto: CreateFoodCategoriesDto) {
    // ✅ NestJS automatically validates DTO structure
    const created = await this.createFoodCategoriesUseCase.execute(dto);
    return ResponseFoodCategoriesDto.fromDomain(created); // ✅ Clean response
  }
}
```

**Responsibilities:**

- HTTP request/response handling
- Input validation via DTOs and ValidationPipes
- Route definitions
- Delegate business logic to services
- **Does NOT handle errors manually** (Global Filter does this)

### **2. Service Layer (Business Logic)**

```typescript
@Injectable()
export class CreateFoodCategoriesUseCase {
  async execute(dto: CreateFoodCategoriesDto): Promise<FoodCategories> {
    // ✅ Business existence check
    const existingCategory = await this.repository.findByName(dto.name);
    if (existingCategory) {
      throw new FoodCategoryAlreadyExistsError(dto.name); // ✅ Custom business error
    }

    // ✅ Business validation
    if (!dto.name || dto.name.trim().length < 2) {
      throw new FoodCategoryValidationError(
        'Name must be at least 2 characters',
      );
    }

    const category = FoodCategories.create(dto.name, dto.description);
    return await this.repository.save(category);
  }
}
```

**Responsibilities:**

- Business rules validation
- Existence checks
- Orchestration between domain and infrastructure
- **Throws custom domain errors with specific codes**

### **3. Repository Layer (Database Contact)**

```typescript
@Injectable()
export class FoodCategoriesOrmRepository implements FoodCategoriesRepository {
  async save(category: FoodCategories): Promise<FoodCategories> {
    try {
      // ✅ Pure database operations
      const ormEntity = FoodCategoriesOrmEntity.fromDomain(category);
      this.em.persist(ormEntity);
      await this.em.flush();
      return ormEntity.toDomain();
    } catch (error) {
      // ✅ Handle technical database errors
      throw new InternalError('Database operation failed', error);
    }
  }
}
```

**Responsibilities:**

- Database operations only
- Convert between domain and ORM entities
- Handle technical database errors
- **No business logic**

### **4. Global Exception Filter (Error Mapping)**

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof DomainError) {
      // ✅ Handle custom domain errors
      return {
        success: false,
        error: {
          code: exception.code, // ✅ Custom error code
          message: exception.message, // ✅ Business-friendly message
          httpStatus: exception.httpStatus, // ✅ Proper HTTP status
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      };
    }
    // ✅ Handle unexpected errors uniformly
  }
}
```

**Responsibilities:**

- Centralized error handling
- Map domain errors to HTTP responses
- Consistent response format
- Proper logging

## **🎪 Complete Error Flow Example**

```
POST /food-categories { "name": "Fruits" }
     ↓
🎯 Controller:
   - Validates DTO structure (NestJS ValidationPipe)
   - Calls service
     ↓
💼 Service:
   - Checks if "Fruits" already exists in database
   - Validates business rules (name length, etc.)
   - If exists → throws FoodCategoryAlreadyExistsError("Fruits")
     ↓
🛡️ Global Filter:
   - Catches DomainError
   - Maps to HTTP response
     ↓
📡 HTTP Response:
{
  "success": false,
  "error": {
    "code": "FOOD_CATEGORY_ALREADY_EXISTS",
    "message": "Food category with name 'Fruits' already exists",
    "httpStatus": 409,
    "timestamp": "2025-08-07T10:30:00.000Z",
    "path": "/food-categories"
  }
}
```

## **🔥 Benefits of This Architecture**

| Benefit                           | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| **🎯 Single Responsibility**      | Each layer has one clear job                         |
| **🛡️ Centralized Error Handling** | Global filter handles everything consistently        |
| **📋 Consistent Responses**       | Same format for all errors across the API            |
| **🔍 Traceable**                  | Custom error codes for easy debugging and monitoring |
| **🧪 Testable**                   | Each layer can be tested independently               |
| **🔧 Maintainable**               | Easy to add new error types and modify behavior      |
| **📊 Monitorable**                | Structured logging with error codes and context      |
| **🌐 Client-Friendly**            | Clear, actionable error messages                     |
| **🔄 Scalable**                   | Pattern scales across all modules                    |

## **📚 Error Types Hierarchy**

```typescript
// Base error class
export abstract class DomainError extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly httpStatus: number;
}

// Specific business errors
export class FoodCategoryNotFoundError extends DomainError {
  readonly code = ErrorCode.FOOD_CATEGORY_NOT_FOUND;
  readonly httpStatus = 404;
}

export class FoodCategoryAlreadyExistsError extends DomainError {
  readonly code = ErrorCode.FOOD_CATEGORY_ALREADY_EXISTS;
  readonly httpStatus = 409;
}

export class FoodCategoryValidationError extends DomainError {
  readonly code = ErrorCode.FOOD_CATEGORY_INVALID_DATA;
  readonly httpStatus = 400;
}
```

## **🎯 Layer Responsibility Summary**

| Layer             | Validates             | Throws               | Handles                     |
| ----------------- | --------------------- | -------------------- | --------------------------- |
| **Controllers**   | HTTP structure (DTOs) | -                    | Delegates to services       |
| **Services**      | Business rules        | Custom domain errors | Business logic              |
| **Repositories**  | -                     | Technical errors     | Database operations         |
| **Global Filter** | -                     | -                    | All errors → HTTP responses |

This architecture ensures **business errors are properly categorized**, **technical concerns are separated**, and **clients receive consistent, meaningful responses** regardless of where errors originate! 🎉

## **📖 Related Documentation**

- [NestJS Clean Architecture Structure](./nestjs-clean-architecture-structure.md)
- [Error Response Examples](./error-response-examples.md)
