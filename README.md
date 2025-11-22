# TinyLink - URL Shortener

A modern URL shortening service built with Next.js and PostgreSQL. Create short, memorable links and track their analytics.

## 🚀 Live Demo

- **Live URL**: [Vercel URL here]
- **GitHub**: [https://github.com/eklavya-byte]

## ✨ Features

- ✅ Create custom short links or auto-generate them
- ✅ Track click statistics and analytics
- ✅ View detailed stats for each link
- ✅ Delete links
- ✅ Search and filter links
- ✅ Responsive design
- ✅ HTTP 302 redirects
- ✅ Duplicate code detection (409 Conflict)
- ✅ Health check endpoint

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 API Endpoints

### Links Management

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/api/links` | Create a new short link | 201, 400, 409, 500 |
| GET | `/api/links` | List all links | 200, 500 |
| GET | `/api/links/:code` | Get stats for a link | 200, 404, 500 |
| DELETE | `/api/links/:code` | Delete a link | 200, 404, 500 |

### Pages

| Path | Description |
|------|-------------|
| `/` | Dashboard - List all links |
| `/code/:code` | Stats page for a specific link |
| `/:code` | Redirect to target URL (302) |
| `/healthz` | Health check endpoint |

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tinylink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your database URL:
   ```
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
   ```

4. **Initialize the database**
   
   The database table will be created automatically when you start the app. The schema:
   ```sql
   CREATE TABLE IF NOT EXISTS links (
     id SERIAL PRIMARY KEY,
     code VARCHAR(8) UNIQUE NOT NULL,
     target_url TEXT NOT NULL,
     clicks INTEGER DEFAULT 0,
     last_clicked TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📝 Usage

### Creating a Short Link

1. Click "Add Link" on the dashboard
2. Enter the target URL (e.g., `https://example.com/very/long/url`)
3. (Optional) Enter a custom code (6-8 alphanumeric characters)
4. Click "Create Link"

### Using a Short Link

Visit `http://yourdomain.com/{code}` to be redirected to the target URL.

### Viewing Statistics

Click the analytics icon (📊) next to any link to view detailed statistics.

### Deleting a Link

Click the delete icon (🗑️) next to any link to remove it.

## 🔍 Code Validation

Short codes must follow these rules:
- 6-8 characters long
- Only alphanumeric characters [A-Za-z0-9]
- Globally unique across all users

## 🏥 Health Check

Check application status:
```bash
curl http://localhost:3000/healthz
```

Response:
```json
{
  "ok": true,
  "version": "1.0",
  "uptime": 3600,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production"
}
```

## 🧪 Testing

### Manual Testing

1. **Create a link**:
   ```bash
   curl -X POST http://localhost:3000/api/links \
     -H "Content-Type: application/json" \
     -d '{"targetUrl": "https://google.com", "customCode": "test123"}'
   ```

2. **List all links**:
   ```bash
   curl http://localhost:3000/api/links
   ```

3. **Get link stats**:
   ```bash
   curl http://localhost:3000/api/links/test123
   ```

4. **Test redirect**:
   ```bash
   curl -L http://localhost:3000/test123
   ```

5. **Delete a link**:
   ```bash
   curl -X DELETE http://localhost:3000/api/links/test123
   ```

### Expected Status Codes

- `200` - Success (GET, DELETE)
- `201` - Created (POST)
- `302` - Redirect (/:code)
- `400` - Bad Request (invalid input)
- `404` - Not Found (link doesn't exist)
- `409` - Conflict (duplicate code)
- `500` - Server Error

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
4. Deploy!

### Deploy to Render/Railway

1. Create a new Web Service
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

## 🗂️ Project Structure

```
tinylink/
├── app/
│   ├── api/
│   │   └── links/
│   │       ├── route.js           # GET, POST /api/links
│   │       └── [code]/
│   │           └── route.js       # GET, DELETE /api/links/:code
│   ├── code/
│   │   └── [code]/
│   │       └── page.js            # Stats page
│   ├── [code]/
│   │   ├── page.js                # Redirect page
│   │   └── not-found.js           # 404 page
│   ├── healthz/
│   │   └── route.js               # Health check
│   ├── page.js                    # Dashboard
│   └── layout.js                  # Root layout
├── lib/
│   └── db.js                      # Database connection
├── .env                           # Environment variables
├── .env.example                   # Example environment variables
├── package.json
└── README.md
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Visual feedback during operations
- **Error Handling**: Clear error messages
- **Success Feedback**: Confirmation messages
- **Copy to Clipboard**: Quick copy buttons
- **Form Validation**: Inline validation and helpful hints
- **Empty States**: Guidance when no links exist
- **Search/Filter**: Find links quickly

## 🔒 Security Considerations

- URL validation before saving
- SQL injection prevention (parameterized queries)
- Input sanitization
- Error message sanitization (no sensitive data exposure)

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check if your IP is whitelisted in Neon
- Ensure SSL mode is enabled

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## 📄 License

MIT License

## 👤 Author

[Prem Prakash]
- GitHub: [(https://github.com/eklavya-byte)]
- Email: premascii@gmail.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Neon for PostgreSQL hosting
- Vercel for deployment platform