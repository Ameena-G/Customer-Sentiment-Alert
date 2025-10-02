# ⚡ Quick Start (5 Minutes)

Get SentiGuard running in 5 minutes!

## Terminal 1 - Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python app.py
```

Wait for "Application startup complete" message.

## Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

## Open Browser

Go to: **http://localhost:3000**

## ✅ You're Done!

You should see:
- ✅ Live dashboard with sentiment data
- ✅ Green "Live" indicator (WebSocket connected)
- ✅ Demo data appearing every 10-30 seconds
- ✅ Charts updating in real-time

## 🎯 Try This

1. Click **"🚨 Demo Crisis"** button
2. Watch alerts appear in right panel
3. See sentiment chart spike downward
4. Click **"Mark as Resolved"** on alerts

## 🐛 Not Working?

### Backend Error?
- Make sure Python 3.9+ is installed: `python --version`
- Check if port 8000 is free
- Look for error messages in terminal

### Frontend Error?
- Make sure Node.js 18+ is installed: `node --version`
- Try: `npm cache clean --force` then `npm install` again
- Check if backend is running

### Connection Error in Browser?
- Backend must be running first
- Check backend terminal for "Application startup complete"
- Refresh browser page

## 📚 Next Steps

- Read `SETUP_GUIDE.md` for detailed setup
- Read `HACKATHON_GUIDE.md` for demo tips
- Customize demo data in `backend/services/demo_data.py`

---

**First time setup takes ~5-10 minutes** (downloading models and dependencies).

**Subsequent starts take ~30 seconds**.

Good luck! 🚀
