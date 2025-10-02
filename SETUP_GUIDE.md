# 🚀 SentiGuard - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have:
- **Python 3.9+** installed
- **Node.js 18+** and npm installed
- **Git** (optional, for version control)

## Step-by-Step Setup

### 1. Backend Setup (Python/FastAPI)

#### Navigate to backend folder
```bash
cd backend
```

#### Create virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install dependencies
```bash
pip install -r requirements.txt
```

#### Download NLP models (first time only)
```bash
python -c "from transformers import pipeline; pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english'); pipeline('text-classification', model='j-hartmann/emotion-english-distilroberta-base')"
```

This will download ~500MB of models. It only needs to be done once.

#### Configure environment (optional)
```bash
# Copy example env file
copy .env.example .env

# Edit .env and add your API keys (optional for demo)
# For hackathon demo, you can skip this step
```

#### Run the backend
```bash
python app.py
```

✅ Backend should now be running on `http://localhost:8000`

### 2. Frontend Setup (React/TypeScript)

#### Open a NEW terminal and navigate to frontend folder
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

This will install all React dependencies (~200MB).

#### Run the frontend
```bash
npm run dev
```

✅ Frontend should now be running on `http://localhost:3000`

### 3. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the SentiGuard dashboard with live demo data!

## 🎯 Quick Test

1. **Check Live Connection**: Look for the green "Live" indicator in the top right
2. **Watch Demo Data**: New sentiment mentions should appear every 10-30 seconds
3. **Trigger Crisis**: Click the "🚨 Demo Crisis" button to simulate a negative sentiment spike
4. **View Alerts**: Check the right panel for generated alerts
5. **Explore Charts**: See real-time sentiment trends

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
**Solution**: Make sure you activated the virtual environment and ran `pip install -r requirements.txt`

**Problem**: Backend won't start on port 8000
**Solution**: Check if another app is using port 8000. Kill it or change the port in `config.py`

**Problem**: Models downloading very slowly
**Solution**: This is normal for first-time setup. Models are ~500MB. Be patient or use a faster internet connection.

### Frontend Issues

**Problem**: `npm install` fails
**Solution**: 
```bash
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

**Problem**: "Connection Error" in browser
**Solution**: Make sure the backend is running on port 8000. Check the terminal for errors.

**Problem**: WebSocket not connecting
**Solution**: 
- Ensure backend is running
- Check browser console for errors
- Try refreshing the page

### Common Issues

**Problem**: CORS errors in browser console
**Solution**: This shouldn't happen with the current setup, but if it does, make sure both frontend and backend are running on localhost.

**Problem**: No demo data appearing
**Solution**: 
- Check backend terminal for errors
- Verify WebSocket connection (green "Live" indicator)
- Try clicking "Demo Crisis" button

## 📊 API Endpoints (for testing)

You can test the backend directly:

```bash
# Get sentiment statistics
curl http://localhost:8000/api/sentiments/stats

# Get recent sentiments
curl http://localhost:8000/api/sentiments

# Get alerts
curl http://localhost:8000/api/alerts

# Trigger crisis demo
curl -X POST http://localhost:8000/api/demo/crisis
```

## 🎬 Demo Mode

The application runs in demo mode by default, generating realistic customer feedback automatically. This is perfect for hackathon presentations!

**Demo features:**
- Auto-generates tweets, Reddit posts, reviews every 10-30 seconds
- Realistic sentiment distribution (mix of positive/negative/neutral)
- Automatic alert generation for negative sentiment
- Crisis simulation button for dramatic demos

## 🔑 Adding Real Data Sources (Optional)

To connect real Twitter/Reddit APIs:

1. Get API keys:
   - **Twitter**: https://developer.twitter.com
   - **Reddit**: https://www.reddit.com/prefs/apps

2. Add to `backend/.env`:
```env
TWITTER_BEARER_TOKEN=your_token_here
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_secret
```

3. Uncomment the monitoring code in `backend/app.py` (search for "TODO: Add real monitoring")

## 🚀 Production Deployment

For production deployment:

### Backend
```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend
```bash
# Build for production
npm run build

# Serve with any static server
npx serve -s dist
```

### Environment Variables
Update CORS settings in `backend/app.py` to only allow your frontend domain.

## 📝 Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- **Backend**: Automatically reloads when you save Python files
- **Frontend**: Automatically refreshes when you save React files

### Debugging
- **Backend logs**: Check the terminal where `python app.py` is running
- **Frontend logs**: Open browser DevTools (F12) → Console tab
- **Network**: DevTools → Network tab to see API calls

### Code Structure
```
backend/
├── app.py              # Main FastAPI app
├── config.py           # Configuration
├── models/             # Database models
├── services/           # Business logic (NLP, alerts, demo data)
└── requirements.txt    # Python dependencies

frontend/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks (WebSocket)
│   ├── lib/            # Utilities (API client)
│   └── App.tsx         # Main app component
└── package.json        # Node dependencies
```

## 🎓 Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **Transformers**: https://huggingface.co/docs/transformers
- **Recharts**: https://recharts.org/
- **TailwindCSS**: https://tailwindcss.com/

## 🏆 Hackathon Tips

1. **Practice your demo** - Run through it 3-4 times
2. **Prepare for offline** - Record a video backup
3. **Have talking points ready** - Technical depth + business value
4. **Show the crisis demo** - It's the most impressive feature
5. **Explain the AI** - Judges love hearing about the NLP models

## 💡 Next Steps

Once everything is running:
1. Explore the dashboard
2. Click around and understand each component
3. Read the `HACKATHON_GUIDE.md` for presentation tips
4. Customize the demo data in `backend/services/demo_data.py`
5. Practice your pitch!

---

**Need help?** Check the main README.md or HACKATHON_GUIDE.md for more details.

Good luck with your hackathon! 🚀
