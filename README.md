# Solar Dashboard v2

A modern Next.js dashboard for monitoring solar power generation with real-time data from Havells PV Check API.

## 🌞 Features

- **Real-time Monitoring**: Live power generation data with 5-minute intervals
- **24H Power Chart**: Detailed power generation curve throughout the day
- **Daily Generation Chart**: Weekly/monthly production overview
- **Production Metrics**: Today, month, year, and total production stats
- **System Status**: Active/inactive monitoring with badges
- **Responsive Design**: Beautiful UI with shadcn/ui components

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Add your database API token for authentication
DB_TOKEN=your_database_token_here

# Add your authorization token for local API access (updateKey endpoint)
AUTH=your_local_auth_token_here
```

The application will automatically fetch the Havells PV Check API token from your database API at runtime.

### 3. API Configuration

The API is already configured in `app/config/api.ts`:

- **Base URL**: https://pvcheck.havells.com
- **Device ID**: 63295957
- **Endpoint**: `/maintain-s/history/power/{DEVICE_ID}/record`

### 4. Run Development Server

```bash
npm run dev
```

### 5. Access Dashboard

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📊 Dashboard Components

### Metrics Cards

- **Production-Today**: Daily kWh generation
- **Production-This Month**: Monthly total
- **Production-This Year**: Yearly total
- **Total Production**: Lifetime estimate
- **Production Power**: Current/peak power
- **Installed Capacity**: System capacity estimate

### Charts

- **24H Power Chart**: Real-time power generation curve
- **Daily Chart**: Daily kWh production over time

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 Project Structure

```
app/
├── components/          # UI components
│   ├── MetricsCards.tsx # Production metrics
│   ├── PowerChart24H.tsx# 24-hour power chart
│   └── DailyChart.tsx   # Daily generation chart
├── config/
│   └── api.ts          # API configuration
├── hooks/
│   └── useSolarData.ts # Data fetching hook
├── types/
│   └── solar.ts        # TypeScript interfaces
├── utils/
│   └── solar.ts        # Data processing utilities
├── dashboard/
│   └── page.tsx        # Main dashboard page
└── page.tsx            # Landing page
```

## 🔧 API Integration

The dashboard fetches live data from the Havells PV Check API:

```typescript
// Get today's power generation data
const response = await getPowerHistory(2025, 1, 23);

// Response includes:
// - statistics: Daily totals and metrics
// - records: 5-minute interval power data
```

### Update Key API

You can update the solar API token stored in the database using the `/api/updateKey` endpoint:

```bash
curl -X POST http://localhost:3000/api/updateKey \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key": "new-solar-api-token"}'
```

**Note**: Requires `AUTH` environment variable to be set for authorization.

### Health API

The app also exposes `/api/health` for dependency health checks.

- Returns `200` with `status: "ok"` when the internal solar dependency is reachable.
- Returns `503` with `status: "error"` when token lookup or the Havells solar API call fails.

## 📈 Data Processing

- **Time Conversion**: Unix timestamps to readable time
- **Power Units**: Watts to kilowatts conversion
- **Aggregation**: Daily, monthly, yearly totals
- **Peak Detection**: Maximum power identification
- **Status Monitoring**: Active/inactive system detection

## 🎨 UI Features

- **Loading States**: Skeleton placeholders during data fetch
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-first responsive layout
- **Refresh Button**: Manual data refresh capability
- **Status Badges**: Color-coded system status indicators

## 🚀 Deployment

1. Build the application:

```bash
npm run build
```

2. Start production server:

```bash
npm start
```

3. Set environment variables on your hosting platform

## 📝 Notes

- Ensure your API token has proper permissions
- The dashboard auto-refreshes data periodically
- Charts are optimized for solar generation patterns
- All times are displayed in local timezone

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ for solar energy monitoring
