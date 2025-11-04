# MongoDB Setup Guide

## 🎯 Recommended: MongoDB Atlas (Cloud - Free)

This is the **EASIEST** option and requires no local installation!

### Steps:

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Free Cluster**
   - Choose "Build a Database"
   - Select **FREE** M0 tier (shared)
   - Choose a cloud provider and region close to you
   - Click "Create Cluster" (takes 1-3 minutes)

3. **Create Database User**
   - Click "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `argouser`
   - Password: Click "Autogenerate Secure Password" and **SAVE IT**
   - Database User Privileges: Select "Atlas admin"
   - Click "Add User"

4. **Allow Network Access**
   - Click "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Click "Drivers"
   - Copy the connection string (looks like this):
     ```
     mongodb+srv://argouser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add database name at the end: `/argo-travel`
   
   Final string should look like:
   ```
   mongodb+srv://argouser:YourPassword123@cluster0.xxxxx.mongodb.net/argo-travel?retryWrites=true&w=majority
   ```

6. **Update Your .env File**
   - Open: `backend\.env`
   - Replace the MONGODB_URI line with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://argouser:YourPassword123@cluster0.xxxxx.mongodb.net/argo-travel?retryWrites=true&w=majority
   ```

7. **Test Connection**
   ```powershell
   cd C:\Users\Radiance_Tech\Desktop\website-project\backend
   npm install
   npm start
   ```
   
   You should see: "MongoDB Connected" ✅

---

## 💻 Alternative: Local MongoDB Installation

If you prefer to install MongoDB locally:

### Option 1: MongoDB Installer

1. **Download**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: 7.0.x (current)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Install as a Service: **YES**
   - Install MongoDB Compass: **YES** (helpful GUI tool)
   - Click through and install

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   net start MongoDB
   ```

5. **Update .env**
   - Keep the default in `backend\.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/argo-travel
   ```

### Option 2: Using Docker

If you have Docker Desktop installed:

```powershell
# Pull and run MongoDB
docker run -d -p 27017:27017 --name argo-mongodb mongo:latest

# Check it's running
docker ps
```

Then use the default connection string:
```env
MONGODB_URI=mongodb://localhost:27017/argo-travel
```

---

## 🧪 Testing Your Connection

After setting up MongoDB (Atlas or Local):

1. **Install backend dependencies** (if not done already):
   ```powershell
   cd C:\Users\Radiance_Tech\Desktop\website-project\backend
   npm install
   ```

2. **Start the backend**:
   ```powershell
   npm start
   ```

3. **Look for success message**:
   ```
   Server running on port 5000
   MongoDB Connected ✓
   ```

If you see "MongoDB Connected", you're all set! 🎉

---

## ❌ Troubleshooting

### "MongooseServerSelectionError"
- **Atlas**: Check username/password in connection string
- **Atlas**: Ensure you added your IP to Network Access
- **Local**: Ensure MongoDB service is running: `net start MongoDB`

### "Authentication failed"
- Check username and password in connection string
- Password might need URL encoding (spaces, special characters)

### "Connection timeout"
- **Atlas**: Check your internet connection
- **Local**: Check if MongoDB is running: `Get-Service MongoDB`

### Still having issues?
1. Check `backend\.env` file has correct connection string
2. Try MongoDB Compass to test connection separately
3. Check firewall isn't blocking port 27017

---

## 📊 MongoDB Compass (GUI Tool)

MongoDB Compass is a visual tool to view/edit your database:

1. **Download**: https://www.mongodb.com/try/download/compass
2. **Connect**: 
   - Paste your connection string
   - Or use: `mongodb://localhost:27017` for local
3. **View Data**:
   - Database: `argo-travel`
   - Collections: `users`, `trips`, `bookings`

---

## ✅ Ready to Continue?

Once MongoDB is connected:
1. Go back to **START.md**
2. Follow "Step 3: Start Backend Server"
3. Then start the frontend in a new terminal

Need help? Check the main **README.md** for more details!
