# MaitriDhatri - Food Donation Platform

## API Endpoints

### Accept Donation
Accept an available donation for pickup.

**Endpoint:** `PATCH /api/donations/:id/accept`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Example Request:**
```bash
curl -X PATCH "http://localhost:5002/api/donations/64f1a2b3c4d5e6f7g8h9i0j1/accept" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Rice & Curry",
  "quantity": 20,
  "unit": "servings",
  "status": "ACCEPTED",
  "assignedCollector": "64f1a2b3c4d5e6f7g8h9i0j2",
  "acceptedAt": "2023-09-01T10:30:00.000Z",
  "donor": {
    "name": "John Doe"
  }
}
```

### Get Active Pickups
Get all active pickups for the current collector.

**Endpoint:** `GET /api/donations/active/my`

**Headers:**
```
Authorization: Bearer <token>
```

**Example Request:**
```bash
curl -X GET "http://localhost:5002/api/donations/active/my" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "donation": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Rice & Curry",
      "quantity": "20 servings",
      "location": "Downtown",
      "donor": {
        "name": "John Doe"
      },
      "tags": ["Rice", "Curry"]
    },
    "pickupTime": "2023-09-01T11:30:00.000Z",
    "acceptedAt": "2023-09-01T10:30:00.000Z",
    "createdAt": "2023-09-01T10:30:00.000Z"
  }
]
```

## Database Setup

### Seed an OPEN Donation
Connect to MongoDB and insert a test donation:

```javascript
db.donations.insertOne({
  title: "Test Rice Donation",
  type: "Rice",
  quantity: 10,
  unit: "kg",
  address: "123 Test Street",
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  status: "OPEN",
  donor: ObjectId("64f1a2b3c4d5e6f7g8h9i0j4"), // Replace with actual donor ID
  priority: "high"
});
```

### MongoDB Shell Commands
```bash
# Connect to MongoDB
mongosh "mongodb://127.0.0.1:27017/maitri_dhatri"

# Switch to database
use maitri_dhatri

# Insert test donation
db.donations.insertOne({...})

# Check donations
db.donations.find({status: "OPEN"})
```

## Development

### Running the Application
1. Start the backend server:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. Start the frontend client:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

### Environment Variables
Create `.env` file in server directory:
```
PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/maitri_dhatri
JWT_SECRET=your_jwt_secret
```

## Testing the Accept Flow
1. Create a test donation with status "OPEN"
2. Login as a collector
3. Navigate to Collector Dashboard
4. Click "Accept Pickup" on an available donation
5. Verify the donation moves to "Active Pickups"
6. Check database for updated status and assignedCollector
