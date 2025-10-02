# 🏗️ SentiGuard Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Charts   │  │ Alerts   │  │ Insights │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                          │                                    │
│                    ┌─────▼─────┐                            │
│                    │  API      │                            │
│                    │  Client   │                            │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         HTTP │       WebSocket         │ HTTP
              │            │            │
┌─────────────▼────────────▼────────────▼─────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  API Endpoints                       │   │
│  │  /api/sentiments  /api/alerts  /api/stats  /ws      │   │
│  └────────┬─────────────────────────────────────────────┘   │
│           │                                                  │
│  ┌────────▼──────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  NLP Service      │  │Alert Service │  │Demo Service │  │
│  │  - DistilBERT     │  │- Thresholds  │  │- Generator  │  │
│  │  - RoBERTa        │  │- Severity    │  │- Scenarios  │  │
│  │  - TextBlob       │  │- Suggestions │  │             │  │
│  └────────┬──────────┘  └──────┬───────┘  └──────┬──────┘  │
│           │                    │                  │          │
│           └────────────────────┼──────────────────┘          │
│                                │                             │
│                    ┌───────────▼──────────┐                  │
│                    │   Database Layer     │                  │
│                    │   (SQLAlchemy ORM)   │                  │
│                    └───────────┬──────────┘                  │
└────────────────────────────────┼──────────────────────────────┘
                                 │
                    ┌────────────▼──────────┐
                    │   SQLite Database     │
                    │  - sentiment_records  │
                    │  - alerts             │
                    └───────────────────────┘
```

## Data Flow

### 1. Sentiment Analysis Flow

```
New Mention → NLP Service → Sentiment Score → Database → WebSocket → Frontend
     │            │              │                │           │
     │            │              │                │           └─→ Update UI
     │            │              │                │
     │            │              │                └─→ Check Alert Thresholds
     │            │              │                         │
     │            │              │                         ▼
     │            │              │                   Create Alert?
     │            │              │                         │
     │            │              │                         ├─→ Yes → Alert Service
     │            │              │                         │         │
     │            │              │                         │         ▼
     │            │              │                         │   Generate Response
     │            │              │                         │         │
     │            │              │                         │         ▼
     │            │              │                         │   Save to Database
     │            │              │                         │         │
     │            │              │                         │         ▼
     │            │              │                         │   Broadcast Alert
     │            │              │                         │
     │            │              │                         └─→ No → Continue
     │            │              │
     │            │              └─→ Calculate Emotions
     │            │
     │            └─→ Combine DistilBERT + TextBlob
     │
     └─→ Text Preprocessing
```

### 2. Real-time Update Flow

```
Backend Event → WebSocket Manager → Broadcast → All Connected Clients
     │                                              │
     │                                              ├─→ Client 1 (Update UI)
     │                                              ├─→ Client 2 (Update UI)
     │                                              └─→ Client N (Update UI)
     │
     └─→ Event Types:
         - sentiment (new mention analyzed)
         - alert (new alert created)
         - stats (statistics updated)
```

### 3. Alert Generation Flow

```
Sentiment Score → Threshold Check → Severity Calculation → Alert Creation
      │                 │                    │                    │
      │                 │                    │                    ├─→ Title
      │                 │                    │                    ├─→ Message
      │                 │                    │                    ├─→ Severity
      │                 │                    │                    └─→ Suggested Response
      │                 │                    │
      │                 │                    └─→ Levels:
      │                 │                        - Critical (< 0.2)
      │                 │                        - High (< 0.3)
      │                 │                        - Medium (< 0.4)
      │                 │                        - Low (trend)
      │                 │
      │                 └─→ Conditions:
      │                     - Single very negative
      │                     - Negative trend
      │                     - Volume spike
      │
      └─→ Recent Sentiment History
```

## Component Architecture

### Frontend Components

```
App.tsx
 ├─→ Dashboard.tsx (Main Layout)
 │    ├─→ SentimentChart.tsx (Trend Visualization)
 │    │    └─→ Recharts (Line/Area Charts)
 │    │
 │    ├─→ SourceMonitor.tsx (Live Feed)
 │    │    └─→ SentimentCard (Individual Mentions)
 │    │
 │    ├─→ AlertPanel.tsx (Alert List)
 │    │    └─→ AlertCard (Individual Alerts)
 │    │
 │    └─→ InsightsPanel.tsx (AI Insights)
 │         └─→ Metrics & Recommendations
 │
 ├─→ useWebSocket.ts (Custom Hook)
 │    └─→ Socket.io Client
 │
 └─→ api.ts (HTTP Client)
      └─→ Axios
```

### Backend Services

```
app.py (FastAPI Application)
 ├─→ REST Endpoints
 │    ├─→ GET /api/sentiments
 │    ├─→ GET /api/sentiments/stats
 │    ├─→ GET /api/alerts
 │    ├─→ POST /api/alerts/{id}/resolve
 │    ├─→ POST /api/analyze
 │    └─→ POST /api/demo/crisis
 │
 ├─→ WebSocket Endpoint
 │    └─→ /ws (Socket.io)
 │
 ├─→ Services
 │    ├─→ NLPService
 │    │    ├─→ analyze_sentiment()
 │    │    ├─→ _analyze_emotions()
 │    │    └─→ generate_response_suggestion()
 │    │
 │    ├─→ AlertService
 │    │    ├─→ should_create_alert()
 │    │    ├─→ create_alert_message()
 │    │    └─→ calculate_sentiment_trend()
 │    │
 │    └─→ DemoDataGenerator
 │         ├─→ generate_demo_mention()
 │         ├─→ generate_batch()
 │         └─→ generate_crisis_scenario()
 │
 └─→ Database Models
      ├─→ SentimentRecord
      └─→ Alert
```

## Database Schema

### sentiment_records

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| source | VARCHAR(50) | twitter, reddit, review, support |
| source_id | VARCHAR(200) | Unique identifier from source |
| text | TEXT | Original text content |
| sentiment_score | FLOAT | -1 to 1 scale |
| sentiment_label | VARCHAR(20) | positive, negative, neutral |
| confidence | FLOAT | 0 to 1 confidence score |
| emotions | TEXT | JSON string of emotions |
| author | VARCHAR(200) | Username/author |
| created_at | DATETIME | When mention was created |
| processed_at | DATETIME | When we processed it |

**Indexes:**
- `source` (for filtering by source)
- `source_id` (unique, for deduplication)
- `created_at` (for time-based queries)

### alerts

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| severity | VARCHAR(20) | critical, high, medium, low |
| title | VARCHAR(200) | Alert title |
| message | TEXT | Alert message |
| sentiment_record_id | INTEGER | FK to sentiment_records |
| suggested_response | TEXT | AI-generated response |
| is_resolved | INTEGER | 0 = false, 1 = true |
| created_at | DATETIME | When alert was created |
| resolved_at | DATETIME | When alert was resolved |

**Indexes:**
- `sentiment_record_id` (for joins)
- `created_at` (for sorting)

## NLP Pipeline

### Sentiment Analysis

```
Input Text
    │
    ├─→ Preprocessing
    │    ├─→ Truncate to 512 tokens
    │    └─→ Clean text
    │
    ├─→ DistilBERT Analysis
    │    ├─→ Tokenization
    │    ├─→ Model Inference
    │    └─→ Output: POSITIVE/NEGATIVE + confidence
    │
    ├─→ TextBlob Analysis (Backup)
    │    └─→ Output: Polarity (-1 to 1)
    │
    ├─→ Score Combination
    │    └─→ Weighted Average (70% BERT, 30% TextBlob)
    │
    └─→ Final Output
         ├─→ score: -1 to 1
         ├─→ label: positive/negative/neutral
         └─→ confidence: 0 to 1
```

### Emotion Detection

```
Input Text
    │
    ├─→ RoBERTa Model
    │    ├─→ Tokenization
    │    ├─→ Model Inference
    │    └─→ Output: Top emotions with scores
    │
    └─→ Emotions Detected
         ├─→ joy
         ├─→ sadness
         ├─→ anger
         ├─→ fear
         ├─→ disgust
         └─→ surprise
```

## WebSocket Protocol

### Client → Server

```json
{
  "type": "ping",
  "timestamp": "2025-10-02T13:23:16Z"
}
```

### Server → Client

#### Sentiment Event
```json
{
  "type": "sentiment",
  "data": {
    "id": 123,
    "source": "twitter",
    "text": "Love this product!",
    "sentiment_score": 0.85,
    "sentiment_label": "positive",
    "confidence": 0.92,
    "emotions": {"joy": 0.87, "surprise": 0.23},
    "author": "john_doe",
    "created_at": "2025-10-02T13:23:16Z"
  }
}
```

#### Alert Event
```json
{
  "type": "alert",
  "data": {
    "id": 45,
    "severity": "critical",
    "title": "🚨 CRITICAL Sentiment Alert",
    "message": "Detected critical negative sentiment...",
    "sentiment_record_id": 123,
    "suggested_response": "We sincerely apologize...",
    "created_at": "2025-10-02T13:23:16Z"
  }
}
```

## Performance Optimizations

### Backend
1. **Model Loading** - Load once on startup, reuse for all requests
2. **Async Processing** - Use async/await for I/O operations
3. **Database Indexing** - Indexes on frequently queried columns
4. **Connection Pooling** - SQLAlchemy connection pool
5. **Batch Processing** - Process multiple mentions together

### Frontend
1. **Code Splitting** - Lazy load components
2. **Memoization** - useMemo for expensive calculations
3. **Virtual Scrolling** - For long lists (if needed)
4. **Debouncing** - For search/filter inputs
5. **Optimistic Updates** - Update UI before server confirms

## Security Considerations

### Backend
- **Input Validation** - Pydantic models validate all inputs
- **SQL Injection** - SQLAlchemy ORM prevents SQL injection
- **CORS** - Configured to allow only frontend origin
- **Rate Limiting** - Can add with slowapi middleware
- **Environment Variables** - Sensitive data in .env

### Frontend
- **XSS Prevention** - React auto-escapes by default
- **API Keys** - Never in frontend code
- **HTTPS** - Required in production
- **Content Security Policy** - Can add headers

## Scalability Strategy

### Current Capacity
- **Users**: 100+ concurrent
- **Mentions**: 10,000+ per hour
- **Database**: 1GB+ storage

### Scaling to 10x

1. **Horizontal Scaling**
   - Add more backend instances
   - Load balancer (Nginx/AWS ALB)
   - Sticky sessions for WebSocket

2. **Database**
   - Migrate to PostgreSQL
   - Connection pooling
   - Read replicas for queries

3. **Caching**
   - Redis for hot data
   - Cache sentiment stats
   - Cache recent mentions

4. **Queue System**
   - Redis Queue or Celery
   - Async sentiment processing
   - Background alert generation

5. **CDN**
   - Serve frontend from CDN
   - Cache static assets
   - Edge locations worldwide

### Scaling to 100x

1. **Microservices**
   - Separate NLP service
   - Separate alert service
   - API gateway

2. **Message Queue**
   - RabbitMQ or Kafka
   - Event-driven architecture
   - Guaranteed delivery

3. **Distributed Database**
   - PostgreSQL with sharding
   - Or NoSQL (MongoDB)
   - Time-series database for metrics

4. **ML Optimization**
   - Model quantization
   - GPU acceleration
   - Batch inference

## Monitoring & Observability

### Metrics to Track
- **Request latency** - API response times
- **Sentiment processing time** - NLP pipeline speed
- **WebSocket connections** - Active connections
- **Alert generation rate** - Alerts per hour
- **Database query time** - Slow query detection
- **Error rate** - 4xx and 5xx errors

### Tools
- **Logging** - Python logging module
- **APM** - New Relic or DataDog (production)
- **Error Tracking** - Sentry
- **Metrics** - Prometheus + Grafana

## Deployment Architecture

### Development
```
Localhost:3000 (Frontend) → Localhost:8000 (Backend) → SQLite
```

### Production
```
CDN (Frontend) → Load Balancer → Backend Instances → PostgreSQL
                                        ↓
                                   Redis Cache
```

## Future Enhancements

1. **Multi-language Support** - Analyze non-English text
2. **Trend Prediction** - ML model to predict sentiment trends
3. **Competitor Analysis** - Compare sentiment vs competitors
4. **Slack/Email Integration** - Send alerts to Slack/email
5. **Custom Alerts** - User-defined alert rules
6. **Sentiment Forecasting** - Predict future sentiment
7. **Mobile App** - React Native mobile app
8. **Advanced Analytics** - Deep dive into sentiment drivers

---

This architecture is designed for **hackathon success** while being **production-ready**. It balances simplicity, performance, and scalability.
