# REST API Plan

## 1. Resources

The API is built around the following core resources based on the database schema and product requirements:

1. **Users**
   - _Database Table_: `users`
   - Primary fields: `id`, `email`, `hashed_password`, `created_at`, `updated_at`

2. **Profiles**
   - _Database Table_: `profiles`
   - Primary fields: `user_id`, `travel_type`, `travel_style`, `meal_preference`
   - One-to-one relationship with Users

3. **Notes**
   - _Database Table_: `notes`
   - Primary fields: `id`, `user_id`, `note_text`, `note_summary`, `plan_id`, `created_at`, `updated_at`
   - One-to-many relationship with Users (and optionally linked to Plans)

4. **Plans**
   - _Database Table_: `plans`
   - Primary fields: `id`, `user_id`, `start_country`, `start_city`, `max_distance`, `plan`, `created_at`
   - One-to-one relationship with Users

5. **Trip Generation** (Business Functionality)
   - Not stored directly as a table. It utilizes data from Notes and Profiles to generate a detailed trip plan using AI.

---

## 2. Endpoints

Below is a list of planned API endpoints grouped by resource and functionality. Every endpoint is secured so that users can only access or manipulate their own data.

### 2.1. Notes Endpoints

- **GET /notes**
  - **Description**: Retrieve a paginated list of notes for the authenticated user.
  - **Query Parameters**: 
    - `page` (number, optional)
    - `limit` (number, optional)
    - `search` (string, optional; filter by note text or summary)
  - **Response**: 
    ```json
    {
      "status": "success",
      "data": [ { "id": "uuid", "note_text": "...", "note_summary": "...", "created_at": "..." }, ... ]
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 500 Internal Server Error

- **POST /notes**
  - **Description**: Create a new note attached to the authenticated user.
  - **Request Payload**:
    ```json
    {
      "note_text": "string (max 1000 characters)",
      "note_summary": "string (max 100 characters)",
      "plan_id": "uuid or null"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "data": { "id": "uuid", "note_text": "...", "note_summary": "...", "created_at": "..." }
    }
    ```
  - **Success Codes**: 201 Created
  - **Error Codes**: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error

- **GET /notes/{id}**
  - **Description**: Retrieve a specific note by its ID (only if owned by the authenticated user).
  - **Response**:
    ```json
    {
      "status": "success",
      "data": { "id": "uuid", "note_text": "...", "note_summary": "...", "created_at": "..." }
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 404 Not Found

- **PUT /notes/{id}**
  - **Description**: Update a note (only if owned by the authenticated user).
  - **Request Payload** (fields optional):
    ```json
    {
      "note_text": "string",
      "note_summary": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "data": { "id": "uuid", "note_text": "...", "note_summary": "...", "updated_at": "..." }
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found

- **DELETE /notes/{id}**
  - **Description**: Delete a specific note (only if owned by the authenticated user).
  - **Response**: 
    ```json
    { "status": "success", "message": "Note deleted successfully." }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 404 Not Found

### 2.2. Profile Endpoints

- **GET /profile**
  - **Description**: Retrieve the authenticated user's profile.
  - **Response**:
    ```json
    {
      "status": "success",
      "data": { "user_id": "uuid", "travel_type": "string|null", "travel_style": "string|null", "meal_preference": "string|null" }
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 404 Not Found

- **POST /profile**
  - **Description**: Create a new profile for the authenticated user. (Used during first-time setup)
  - **Request Payload**:
    ```json
    {
      "travel_type": "string",
      "travel_style": "string",
      "meal_preference": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "data": { "user_id": "uuid", "travel_type": "...", "travel_style": "...", "meal_preference": "..." }
    }
    ```
  - **Success Codes**: 201 Created
  - **Error Codes**: 400 Bad Request, 401 Unauthorized

- **PUT /profile**
  - **Description**: Update the authenticated user's profile.
  - **Request Payload** (fields optional):
    ```json
    {
      "travel_type": "string",
      "travel_style": "string",
      "meal_preference": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "data": { "user_id": "uuid", "travel_type": "...", "travel_style": "...", "meal_preference": "..." }
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 400 Bad Request, 401 Unauthorized

### 2.3. Plans Endpoints

- **GET /plan**
  - **Description**: Retrieve the authenticated user's saved trip plan.
  - **Response**:
    ```json
    {
      "status": "success",
      "data": { "id": "uuid", "start_country": "string|null", "start_city": "string|null", "max_distance": "number|null", "plan": "string|null", "created_at": "..." }
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 404 Not Found

- **POST /plan**
  - **Description**: Save or update a trip plan for the authenticated user. This endpoint may be used after a trip is generated.
  - **Request Payload**:
    ```json
    {
      "start_country": "string",
      "start_city": "string",
      "max_distance": "number",
      "plan": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "data": { "id": "uuid", "start_country": "...", "start_city": "...", "max_distance": 100, "plan": "...", "created_at": "..." }
    }
    ```
  - **Success Codes**: 201 Created
  - **Error Codes**: 400 Bad Request, 401 Unauthorized

- **DELETE /plan**
  - **Description**: Delete the authenticated user's trip plan.
  - **Response**:
    ```json
    { "status": "success", "message": "Plan deleted successfully." }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 401 Unauthorized, 404 Not Found

### 2.4. Trip Generation Endpoint

- **POST /trip/generate**
  - **Description**: Generate a detailed trip plan using the authenticated user's notes and profile preferences. This endpoint integrates with an AI service (e.g., Openrouter) to convert notes and preferences into a coherent travel itinerary.
  - **Request Payload**:
    ```json
    {
      "start_country": "string",
      "start_city": "string",
      "max_distance": "number",
      "selected_note_ids": ["uuid", "uuid", ...]  // Optional: If user selects specific notes
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "data": {
        "plan": "Detailed travel itinerary generated by AI",
        "notes_used": ["uuid", "uuid"],
        "generated_at": "timestamp"
      }
    }
    ```
  - **Success Codes**: 200 OK
  - **Error Codes**: 400 Bad Request, 401 Unauthorized, 429 Too Many Requests (rate limiting), 500 Internal Server Error

---

## 3. Authentication and Authorization

- **Authentication**: All endpoints require the user to be authenticated. Authentication is managed using Supabase Auth (JWT tokens provided in the `Authorization` header).
- **Authorization**: Each endpoint must verify that the requested resource belongs to the authenticated user, enforced both at the API level and via Row Level Security (RLS) in the database.

---

## 4. Validation and Business Logic

- **Validation Rules (from DB Schema)**:
  - **Users**: Ensure `email` uniqueness and proper email format.
  - **Profiles**: Optional string lengths (e.g., travel_type, travel_style, meal_preference up to 100 characters).
  - **Notes**: `note_text` limited to 1000 characters; `note_summary` limited to 100 characters.
  - **Plans**: Validate that `max_distance` is a number and that `start_country`/`start_city` do not exceed character limits (typically 100 characters).

- **Business Logic**:
  - **Note Management**: CRUD operations allow users to manage their quick notes.
  - **Profile Management**: Handling creation and update of user preferences to drive personalized trip planning.
  - **Trip Generation**: Combines user notes and profile data to generate a detailed itinerary. The endpoint validates required fields and calls an external AI service to generate the plan. Rate limiting is applied to avoid abuse.

---

## 5. Common Response Structure

A typical successful response:

```json
{
  "status": "success",
  "data": { ... }
}
```

A typical error response:

```json
{
  "status": "error",
  "message": "Detailed error description."
}
```

---

## 6. Security and Performance Considerations

- **Security**:
  - Endpoints are protected via JWT authentication.
  - Row Level Security in the database ensures users can only access their own data.
  - Input validation prevents malformed or malicious data from entering the system.
  
- **Performance**:
  - Pagination, filtering, and indexing (as defined in the DB schema) ensure efficient data retrieval.
  - Rate limiting is enforced on high-cost operations such as trip generation (integrated with an AI service).
  - Caching strategies may be applied in future iterations to improve performance for frequently accessed data.

---

*Assumptions*: For MVP, synchronous processing is used for the trip generation endpoint. Future improvements may include asynchronous job handling and status polling. 
