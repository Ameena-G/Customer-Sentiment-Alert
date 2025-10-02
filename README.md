# 🚨 SentiGuard - Customer Sentiment Alert System

Real-time customer sentiment monitoring and alerting system powered by AI/NLP. Analyzes social media, reviews, and support tickets to alert teams about negative sentiment spikes before they become crises.

## 🌟 Features

- **Real-time Sentiment Analysis** - Instant classification of customer feedback
- **Multi-source Monitoring** - Twitter, Reddit, reviews, support tickets
- **Smart Alerts** - Threshold-based notifications with severity levels
- **Live Dashboard** - WebSocket-powered real-time updates
- **Trend Visualization** - Historical sentiment tracking
- **AI Insights** - Automated response suggestions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Redis (optional, for production)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 🔑 Configuration

Create `backend/.env` file:
```env
TWITTER_BEARER_TOKEN=your_token_here
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_secret
REDDIT_USER_AGENT=SentiGuard/1.0
```

## 📖 Documentation

See [HACKATHON_GUIDE.md](HACKATHON_GUIDE.md) for detailed setup and demo instructions.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: FastAPI + Transformers + TextBlob
- **Real-time**: Socket.io WebSocket
- **Database**: SQLite (dev) / PostgreSQL (prod)

## 📊 Demo

Visit the dashboard to see:
1. Live sentiment feed from multiple sources
2. Real-time sentiment score trends
3. Alert panel with critical mentions
4. AI-generated response suggestions

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📄 License

MIT License - see LICENSE file for details
