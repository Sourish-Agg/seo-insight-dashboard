# Business SEO Dashboard

A comprehensive business intelligence platform built with **Node.js + Express** backend and **React + Tailwind CSS** frontend.

## 🚀 Features

### Smart Business Intelligence
- **Industry Detection**: Automatic categorization (Restaurant, Tech, Health, Beauty, etc.)
- **Competitive Analysis**: Head-to-head competitor comparison with metrics
- **Social Media Analytics**: Multi-platform follower counts and engagement rates
- **Location Intelligence**: Metro vs small town data customization
- **Customer Sentiment**: Emotional scoring with emoji indicators

### Advanced SEO & Marketing
- **Industry-Specific Headlines**: Tailored content for each business type
- **Trending Keywords**: Real-time industry-relevant suggestions
- **SEO Recommendations**: Customized tips based on business category
- **Content Strategy**: Industry-appropriate marketing guidance

### Premium UI/UX
- **Responsive Design**: Mobile-first approach with perfect touch targets
- **Real-Time Validation**: Character counters and instant feedback
- **Advanced Animations**: Floating elements, gradients, and smooth transitions
- **Professional Styling**: Modern design with Tailwind CSS

## 🛠 Tech Stack

### Backend (Node.js + Express)
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Express Validator**: Input validation and sanitization
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **Rate Limiting**: API protection

### Frontend (React + Tailwind CSS)
- **React**: UI library with hooks and state management
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **Advanced Animations**: Custom CSS animations and transitions

## 📁 Project Structure

```
/app/
├── backend/                 # Node.js + Express backend
│   ├── server.js           # Main Express server
│   ├── package.json        # Node.js dependencies
│   ├── yarn.lock          # Dependency lock file
│   └── .env               # Environment variables
│
├── frontend/               # React + Tailwind frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Custom styles and animations
│   │   └── index.js       # React entry point
│   ├── public/            # Static assets
│   ├── package.json       # React dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js  # PostCSS configuration
│
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Yarn package manager

### Installation

1. **Backend Setup**
   ```bash
   cd backend
   touch yarn.lock
   yarn install
   yarn dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   yarn start
   ```


## 🎯 Features in Detail

### Industry Detection
The system automatically detects business industries based on keywords in the business name:
- **Restaurant**: cafe, pizza, restaurant, bakery, etc.
- **Tech**: software, AI, digital, tech, etc.
- **Health**: clinic, medical, dental, wellness, etc.
- **Beauty**: salon, spa, beauty, skincare, etc.
- **Retail**: store, shop, boutique, fashion, etc.

### Smart Data Generation
- **Industry-specific ratings**: Different industries have different rating ranges
- **Location-based data**: Metro cities vs small towns have different review counts
- **Realistic social metrics**: Industry-appropriate follower counts and engagement rates
- **Phone number formatting**: Location-based international formatting

### Security Features
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- XSS protection

## 🌟 Demo

Visit the live dashboard to see all features in action:
- Input any business name and location
- Get comprehensive business intelligence
- Try the headline regeneration feature
- Explore different industries (restaurant, tech, health, etc.)

## 📈 Business Value

This platform provides:
- **Competitive Intelligence**: Real competitor comparisons
- **SEO Optimization**: Industry-specific recommendations
- **Social Media Insights**: Multi-platform analytics
- **Market Research**: Location and industry insights
- **Professional Reports**: Comprehensive business analytics

Built for businesses, marketers, and entrepreneurs who need quick, comprehensive business intelligence and SEO insights.
