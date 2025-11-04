# Quick Start Guide for Windows

## ✅ Prerequisites Check

### 1. Node.js (Required)
Check if installed:
```powershell
node --version
```
Should show v14 or higher. If not installed, download from https://nodejs.org/

### 2. MongoDB (Required)
You have 3 options:

**Option A: MongoDB Atlas (Cloud - Recommended for quick start)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/argo-travel`)
5. Update `backend\.env` with your connection string

**Option B: Local MongoDB**
1. Download from https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service:
```powershell
net start MongoDB
```

**Option C: Docker**
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🚀 Running the Application

### Step 1: Install Backend Dependencies
```powershell
cd C:\Users\Radiance_Tech\Desktop\website-project\backend
npm install
```

### Step 2: Configure Backend
Edit `backend\.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/argo-travel
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

If using MongoDB Atlas, replace MONGODB_URI with your Atlas connection string.

### Step 3: Start Backend Server
```powershell
cd C:\Users\Radiance_Tech\Desktop\website-project\backend
npm start
```

Keep this terminal open! You should see:
```
Server running on port 5000
MongoDB Connected
```

### Step 4: Start Frontend (New Terminal)
Open a NEW PowerShell terminal:
```powershell
cd C:\Users\Radiance_Tech\Desktop\website-project\frontend
npm start
```

Your browser should automatically open to http://localhost:3000

## 🎯 Testing the Application

### 1. Create Sample Data (Optional)
With backend running, you can add sample trips using MongoDB Compass or shell:

**Using MongoDB Compass:**
1. Download from https://www.mongodb.com/try/download/compass
2. Connect to `mongodb://localhost:27017`
3. Select database `argo-travel`
4. Go to `trips` collection
5. Click "ADD DATA" > "Insert Document"
6. Paste this JSON:

```json
{
  "tripId": "T001",
  "from": "New York",
  "to": "Boston",
  "route": "New York → Boston",
  "departureTime": "06:00 AM",
  "arrivalTime": "04:00 PM",
  "departureDate": "2024-12-15T00:00:00.000Z",
  "price": 48,
  "originalPrice": 84,
  "discount": 43,
  "totalSeats": 50,
  "availableSeats": 12,
  "duration": "2h 15min",
  "rating": 4,
  "reviews": 126,
  "isPopular": true
}
```

### 2. Create a User Account
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in the form:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: password123 (minimum 8 characters)
4. Click "Sign Up"

### 3. Create an Admin Account
After creating a normal user:
1. Open MongoDB Compass
2. Go to `argo-travel` > `users` collection
3. Find your user
4. Click "Edit"
5. Change `isAdmin: false` to `isAdmin: true`
6. Click "Update"
7. Log out and log back in
8. You'll now see the "Admin" menu option

### 4. Test Features
- Browse trips on home page
- Use search filters
- View "My Bookings"
- Check your "Profile"
- Admin users can access "Admin" dashboard

## 🛠️ Troubleshooting

### Port Already in Use
If port 3000 or 5000 is taken:

**For Backend (port 5000):**
Edit `backend\.env`:
```env
PORT=5001
```
Then also update `frontend\package.json`:
```json
"proxy": "http://localhost:5001"
```

**For Frontend (port 3000):**
```powershell
$env:PORT=3001; npm start
```

### MongoDB Connection Error
- **Local:** Ensure MongoDB service is running: `net start MongoDB`
- **Atlas:** Check your connection string has correct username/password
- **Firewall:** Allow MongoDB port 27017

### "Cannot GET /api/..." Error
- Make sure backend server is running
- Check `frontend\package.json` has correct proxy setting
- Clear browser cache and restart

## 📝 Default Test Credentials

After you create a user and make them admin:
- Email: your@email.com (whatever you registered with)
- Password: your password

## 🎨 Features to Test

✅ User Authentication (Signup/Login)
✅ Browse Available Trips
✅ Search and Filter Trips
✅ View Trip Details
✅ User Profile Management
✅ Booking History (when you have bookings)
✅ Admin Dashboard (with admin account)
✅ Trip Management (admin only)
✅ Booking Management (admin only)

## 📧 Need Help?

If you encounter issues:
1. Check both terminal windows for error messages
2. Ensure MongoDB is running
3. Verify `.env` file configuration
4. Check README.md for detailed documentation

Enjoy your Argo Travel Booking Platform! ✈️
