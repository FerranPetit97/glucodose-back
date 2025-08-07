# Error Response Examples

## 1. When trying to get a non-existent food category:
**GET** `/food-categories/999`

```json
{
  "success": false,
  "error": {
    "code": "FOOD_CATEGORY_NOT_FOUND",
    "message": "Food category with id '999' not found",
    "timestamp": "2025-08-07T10:30:00.000Z",
    "path": "/food-categories/999"
  }
}
```

## 2. When trying to create a food category with invalid data:
**POST** `/food-categories`
**Body:** `{ "name": "", "description": "Some description" }`

```json
{
  "success": false,
  "error": {
    "code": "FOOD_CATEGORY_INVALID_DATA",
    "message": "Name is required",
    "timestamp": "2025-08-07T10:30:00.000Z",
    "path": "/food-categories"
  }
}
```

## 3. When trying to create a food category that already exists:
**POST** `/food-categories`
**Body:** `{ "name": "Fruits", "description": "Existing category" }`

```json
{
  "success": false,
  "error": {
    "code": "FOOD_CATEGORY_ALREADY_EXISTS",
    "message": "Food category with name 'Fruits' already exists",
    "timestamp": "2025-08-07T10:30:00.000Z",
    "path": "/food-categories"
  }
}
```

## 4. When trying to update a non-existent food category:
**PATCH** `/food-categories/999`

```json
{
  "success": false,
  "error": {
    "code": "FOOD_CATEGORY_NOT_FOUND",
    "message": "Food category with id '999' not found",
    "timestamp": "2025-08-07T10:30:00.000Z",
    "path": "/food-categories/999"
  }
}
```

## 5. Success response for comparison:
**GET** `/food-categories/1`

```json
{
  "id": "1",
  "name": "Fruits",
  "description": "Fresh fruits and dried fruits"
}
```
