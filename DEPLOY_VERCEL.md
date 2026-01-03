
# 🚀 Deployment Guide: Deploying to Vercel

Since your app uses a **Backend** and **MySQL Database**, you cannot just deploy the frontend static files. You must deploy the entire app correctly.

## ⚠️ Important: You need a Cloud Database
Vercel cannot connect to the MySQL database running on your laptop (`localhost`). 
**You MUST use a cloud database** like [PlanetScale](https://planetscale.com/), [Aiven](https://aiven.io/), or [Clever Cloud](https://www.clever-cloud.com/).

### Step 1: Create a Cloud Database
1. Sign up for a free MySQL database provider (e.g., Aiven or Clever Cloud).
2. Create a database named `hrms_db`.
3. Get your **Host**, **User**, **Password**, and **Port** from their dashboard.

### Step 2: Push Code to GitHub
(I have already done this step for you!)
- Your code is at: `https://github.com/Arindom-dey/dayflow--human-resource-management-.git`

### Step 3: Import to Vercel
1. Go to [Vercel.com](https://vercel.com/) and Log in.
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub Repository: `hrms-agent-manager`.

### Step 4: Configure Environment Variables
In the Vercel **Deploy** screen, click **"Environment Variables"** and add these:

| Name | Value (Example) |
|------|-----------------|
| `DB_HOST` | `mysql-service.CLOUD PROVIDER.com` |
| `DB_USER` | `avnadmin` |
| `DB_PASS` | `YourSecretPassword` |
| `DB_NAME` | `hrms_db` |
| `DB_PORT` | `3306` (or whatever port they give you) |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASS` | `your-app-password` |

### Step 5: Deploy
1. Click **Deploy**.
2. Wait for the build to finish.
3. Once deployed, Vercel will give you a public URL (e.g., `https://hrms-agent-manager.vercel.app`).
4. **Important**: Add this URL to your environment variables as `VITE_API_URL`.
   - Go to Settings -> Environment Variables.
   - Add `VITE_API_URL` = `https://your-app-name.vercel.app`.
   - **Redeploy** (Go to Deployments -> Redeploy) so the frontend picks up the new API URL.

### 🎉 Success!
Your full-stack app is now live.
