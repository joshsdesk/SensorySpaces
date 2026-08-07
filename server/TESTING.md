# Testing the SensorySpaces Authentication System

This guide shows how to test the authentication and child profile endpoints using curl or Postman.

## Prerequisites

1. **Start MongoDB** (if using local):
   ```bash
   # Windows
   mongod
   
   # Or use MongoDB Compass to start
   ```

2. **Create `.env` file** in `/server` directory:
   ```bash
   cp .env.example .env
   ```

3. **Start the server**:
   ```bash
   cd server
   npm run dev
   ```

---

## 1. Register a New User

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "secure123"
  }'
```

**Expected Response:**
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "email": "parent@example.com",
    "preferences": {
      "defaultRadius": 50,
      "notifications": true
    },
    "createdAt": "2026-01-21T..."
  }
}
```

**Save the token** - you'll need it for protected routes!

---

## 2. Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "secure123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

## 3. Get Current User

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "user": {
    "id": "65abc123...",
    "email": "parent@example.com",
    "preferences": { ... }
  }
}
```

---

## 4. Create Child Profile

**Request:**
```bash
curl -X POST http://localhost:5000/api/profiles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Child 1",
    "noiseLevel": ["Quiet", "Moderate"],
    "lighting": ["Dim", "Natural"],
    "crowdDensity": ["Small"],
    "interests": ["Museums/Science", "Animals/Nature"],
    "avoidances": ["Loud Sounds", "Flashing Lights"],
    "desiredFeatures": ["quiet_room", "sensory_tools"],
    "preferredTimeOfDay": ["Morning"],
    "venueType": ["Indoor"],
    "weatherImportance": "Important"
  }'
```

**Expected Response:**
```json
{
  "_id": "65def456...",
  "userId": "65abc123...",
  "name": "Child 1",
  "preferences": {
    "noiseLevel": ["Quiet", "Moderate"],
    "lighting": ["Dim", "Natural"],
    "crowdDensity": ["Small"],
    "interests": ["Museums/Science", "Animals/Nature"],
    "avoidances": ["Loud Sounds", "Flashing Lights"],
    "desiredFeatures": ["quiet_room", "sensory_tools"],
    "preferredTimeOfDay": ["Morning"],
    "venueType": ["Indoor"],
    "weatherImportance": "Important"
  },
  "isActive": true,
  "createdAt": "2026-01-21T..."
}
```

---

## 5. Get All Child Profiles

**Request:**
```bash
curl -X GET http://localhost:5000/api/profiles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
[
  {
    "_id": "65def456...",
    "name": "Child 1",
    "preferences": { ... }
  }
]
```

---

## 6. Test Autocomplete

**Request:**
```bash
curl -X GET "http://localhost:5000/api/search/autocomplete?q=sensory" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "suggestions": [
    {
      "text": "sensory-friendly events",
      "type": "triggered",
      "trigger": "sensory",
      "icon": "🎧"
    },
    {
      "text": "sensory play zones",
      "type": "triggered",
      "trigger": "sensory",
      "icon": "🎧"
    }
  ],
  "query": "sensory"
}
```

---

## 7. Get Popular Searches

**Request:**
```bash
curl -X GET http://localhost:5000/api/search/popular
```

**Expected Response:**
```json
{
  "searches": [
    "sensory-friendly events",
    "quiet hours for families",
    "museum sensory hours",
    "autism friendly activities",
    "therapeutic play events"
  ]
}
```

---

## Error Cases to Test

### Invalid Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "wrongpassword"
  }'
```
**Expected:** `401 Unauthorized`

### Missing Token
```bash
curl -X GET http://localhost:5000/api/profiles
```
**Expected:** `401 Access denied. No token provided.`

### Expired/Invalid Token
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```
**Expected:** `401 Invalid token.`

---

## Using Postman

1. **Import Environment:**
   - Create variable `baseUrl` = `http://localhost:5000`
   - Create variable `token` = (empty, will be set after login)

2. **Register/Login:**
   - Make request
   - Go to "Tests" tab, add:
     ```javascript
     pm.environment.set("token", pm.response.json().token);
     ```

3. **Protected Routes:**
   - In Authorization tab, select "Bearer Token"
   - Use `{{token}}`

---

## Success Criteria

✅ Can register new user  
✅ Can login and receive JWT  
✅ Can access protected routes with token  
✅ Cannot access protected routes without token  
✅ Can create child profile  
✅ Can retrieve profiles for authenticated user  
✅ Autocomplete returns sensory-specific suggestions  

---

**Ready to test!** 🚀
