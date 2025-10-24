# API Documentation

## Base URL

```
https://api.fetisch-dating.com/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Auth Endpoints

### POST /auth/register

Register a new user.

**Request Body:**
```json
{
  "pseudonym": "SilentNinja",
  "email": "user@example.com",
  "password": "securePassword123",
  "ageRange": "25-30",
  "locationLat": 52.52,
  "locationLon": 13.40
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "pseudonym": "SilentNinja",
      "ageRange": "25-30"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/login

Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "pseudonym": "SilentNinja",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/refresh-token

Refresh JWT token (Protected).

**Response (200):**
```json
{
  "status": "success",
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 👤 User Endpoints

### GET /users/profile

Get current user profile (Protected).

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "pseudonym": "SilentNinja",
    "ageRange": "25-30",
    "locationLat": 52.52,
    "locationLon": 13.40,
    "isVerified": true,
    "privacyLevel": 3,
    "photos": [...],
    "tags": [...],
    "personality": {...}
  }
}
```

### PUT /users/profile

Update user profile (Protected).

**Request Body:**
```json
{
  "privacyLevel": 4,
  "locationLat": 52.53,
  "locationLon": 13.41,
  "searchRadiusKm": 75
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Profile updated",
  "data": {...}
}
```

### DELETE /users/profile

Delete account (Protected, requires confirmation).

**Request Body:**
```json
{
  "confirmation": "DELETE_MY_ACCOUNT"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Account deleted"
}
```

---

## 📸 Photo Endpoints

### POST /photos

Upload a photo (Protected).

**Request Body:**
```json
{
  "photoUrl": "https://s3.example.com/photo.jpg",
  "photoType": "object",
  "isPrimary": true
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Photo uploaded",
  "data": {
    "id": "photo-uuid",
    "photoUrl": "...",
    "photoType": "object"
  }
}
```

### GET /photos?userId=<user-id>

Get user photos.

**Response (200):**
```json
{
  "status": "success",
  "data": [...]
}
```

### DELETE /photos/:photoId

Delete photo (Protected).

**Response (200):**
```json
{
  "status": "success",
  "message": "Photo deleted"
}
```

---

## 💘 Match Endpoints

### GET /matches

Get matches for current user (Protected).

**Query Parameters:**
- `limit` (default: 20)
- `offset` (default: 0)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "match-uuid",
      "compatibilityScore": 0.87,
      "user1": {...},
      "user2": {...}
    }
  ]
}
```

### GET /matches/potential

Get potential matches (recommendations) (Protected).

**Query Parameters:**
- `limit` (default: 10)

**Response (200):**
```json
{
  "status": "success",
  "data": [...]
}
```

### POST /matches

Create a match (Protected).

**Request Body:**
```json
{
  "targetUserId": "uuid"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Match created",
  "data": {...}
}
```

### DELETE /matches/:matchId

Reject/delete match (Protected).

**Response (200):**
```json
{
  "status": "success",
  "message": "Match removed"
}
```

---

## 💬 Chat Endpoints

### POST /chat/messages

Send a message (Protected).

**Request Body:**
```json
{
  "recipientId": "uuid",
  "content": "Hallo! Wie geht es dir?"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Message sent",
  "data": {...}
}
```

### GET /chat/:otherUserId

Get conversation (Protected).

**Query Parameters:**
- `limit` (default: 50)

**Response (200):**
```json
{
  "status": "success",
  "data": [...]
}
```

### GET /chat/conversations

Get all conversations (Protected).

**Response (200):**
```json
{
  "status": "success",
  "data": [...]
}
```

### POST /chat/messages/:messageId/read

Mark message as read (Protected).

**Response (200):**
```json
{
  "status": "success",
  "message": "Message marked as read"
}
```

---

## 🏷️ Taxonomy Endpoints

### GET /taxonomy/search

Search for tags.

**Query Parameters:**
- `q` (search query, required)
- `limit` (default: 20)

**Response (200):**
```json
{
  "status": "success",
  "data": [...]
}
```

### GET /taxonomy/tags

Get top-level tags.

**Response (200):**
```json
{
  "status": "success",
  "data": [...]
}
```

### GET /taxonomy/tags/:tagId/subtags

Get subtags.

**Response (200):**
```json
{
  "status": "success",
  "data": [...]
}
```

### POST /taxonomy/user-tags

Set user tags (Protected).

**Request Body:**
```json
{
  "tagIds": ["bdsm.dominance.strict_mistress", "material_fetish.latex"],
  "preference": "interested"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Tags updated",
  "data": {...}
}
```

### GET /taxonomy/user-tags

Get user tags (Protected).

**Response (200):**
```json
{
  "status": "success",
  "data": [...]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error: ..."
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Invalid token or not authenticated"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## WebSocket (Real-time Chat)

Connect to: `ws://localhost:3000/socket`

### Events

**message.send**
```javascript
socket.emit('message.send', {
  recipientId: 'uuid',
  content: 'Hallo!'
});
```

**message.received**
```javascript
socket.on('message.received', (data) => {
  console.log(data.message);
});
```

**typing**
```javascript
socket.emit('typing', {
  recipientId: 'uuid'
});
```

**typing.notification**
```javascript
socket.on('typing.notification', (data) => {
  console.log(`${data.pseudonym} is typing...`);
});
```

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Header**: `X-RateLimit-Remaining`

---

## Versioning

Current Version: **v1**

API endpoints are versioned. Always use `/api/v1/...`

Future versions: `/api/v2/...`, `/api/v3/...`, etc.

---

**Last Updated**: 2025-10-24  
**Status**: MVP
