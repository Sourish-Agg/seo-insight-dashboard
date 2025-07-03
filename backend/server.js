const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, query, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Industry detection patterns
const INDUSTRY_PATTERNS = {
  restaurant: ['restaurant', 'cafe', 'bistro', 'eatery', 'diner', 'grill', 'pizza', 'burger', 'food', 'kitchen', 'bakery', 'pastry', 'cake', 'coffee', 'bar', 'pub'],
  tech: ['tech', 'software', 'digital', 'app', 'web', 'IT', 'computer', 'cyber', 'data', 'cloud', 'AI', 'startup', 'innovation'],
  retail: ['store', 'shop', 'boutique', 'market', 'mall', 'outlet', 'fashion', 'clothing', 'apparel', 'shoes', 'accessories'],
  health: ['clinic', 'hospital', 'medical', 'doctor', 'dentist', 'pharmacy', 'health', 'wellness', 'fitness', 'gym', 'spa'],
  beauty: ['salon', 'spa', 'beauty', 'nails', 'hair', 'skincare', 'cosmetics', 'barber'],
  automotive: ['auto', 'car', 'garage', 'mechanic', 'dealership', 'repair', 'service', 'parts'],
  legal: ['law', 'legal', 'attorney', 'lawyer', 'firm', 'advocates'],
  real_estate: ['real estate', 'property', 'homes', 'realtor', 'broker', 'mortgage'],
  education: ['school', 'academy', 'institute', 'university', 'college', 'training', 'education'],
  finance: ['bank', 'financial', 'investment', 'insurance', 'credit', 'loan']
};

// Enhanced headline templates by industry
const INDUSTRY_HEADLINES = {
  restaurant: [
    "Why {name} is {location}'s Most Talked-About Dining Destination",
    "The Secret Recipe Behind {name}'s Success in {location}",
    "How {name} Became {location}'s Favorite Culinary Experience",
    "Discover What Makes {name} the Best Food Spot in {location}",
    "{name}: Where {location} Locals Go for Unforgettable Meals"
  ],
  tech: [
    "How {name} is Revolutionizing Technology in {location}",
    "Why {name} is {location}'s Leading Tech Innovation Hub",
    "The Digital Transformation Story of {name} in {location}",
    "{name}: Pioneering the Future of Tech in {location}",
    "Why Smart Businesses in {location} Choose {name}"
  ],
  retail: [
    "The Shopping Revolution: Why {name} Dominates {location}",
    "How {name} Became {location}'s Premier Shopping Destination",
    "Why Fashion-Forward {location} Residents Love {name}",
    "{name}: Redefining Retail Excellence in {location}",
    "The Style Story Behind {name}'s Success in {location}"
  ],
  health: [
    "Why {name} is {location}'s Most Trusted Healthcare Provider",
    "The Healing Touch: How {name} Transformed Healthcare in {location}",
    "{name}: Where {location} Families Trust Their Health",
    "Discover Why {name} is {location}'s Premier Medical Facility",
    "The Wellness Revolution Led by {name} in {location}"
  ],
  beauty: [
    "The Beauty Secret: Why {name} is {location}'s Top Choice",
    "How {name} Became {location}'s Most Glamorous Destination",
    "{name}: Where {location}'s Beauty Standards are Set",
    "The Transformation Story of {name} in {location}",
    "Why {location}'s Style Icons Choose {name}"
  ],
  default: [
    "Why {name} is {location}'s Best Kept Secret in 2025",
    "Discover What Makes {name} the Top Choice in {location}",
    "{name}: The {location} Business Everyone's Talking About",
    "How {name} Became {location}'s Most Trusted Local Business",
    "The Ultimate Guide to {name} - {location}'s Hidden Gem"
  ]
};

// Utility Functions
function detectIndustry(businessName) {
  const nameLower = businessName.toLowerCase();
  
  for (const [industry, keywords] of Object.entries(INDUSTRY_PATTERNS)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        return industry;
      }
    }
  }
  
  return 'default';
}

function getLocationType(location) {
  const locationLower = location.toLowerCase();
  const metroCities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'pune', 'hyderabad',
                      'new york', 'london', 'tokyo', 'singapore', 'dubai', 'paris', 'sydney'];
  
  if (metroCities.some(city => locationLower.includes(city))) {
    return 'metro';
  } else if (location.includes(',') && ['usa', 'uk', 'uae', 'singapore'].some(country => locationLower.includes(country))) {
    return 'international';
  } else {
    return 'small_town';
  }
}

function generatePhoneNumber(location) {
  if (location.toLowerCase().includes('mumbai') || location.toLowerCase().includes('india')) {
    return `+91-${Math.floor(Math.random() * (99999 - 70000)) + 70000}-${Math.floor(Math.random() * (99999 - 10000)) + 10000}`;
  } else if (location.toLowerCase().includes('new york') || location.toLowerCase().includes('usa')) {
    return `+1-${Math.floor(Math.random() * (999 - 200)) + 200}-${Math.floor(Math.random() * (999 - 100)) + 100}-${Math.floor(Math.random() * (9999 - 1000)) + 1000}`;
  } else {
    return `+${Math.floor(Math.random() * 999) + 1}-${Math.floor(Math.random() * (999 - 100)) + 100}-${Math.floor(Math.random() * (9999 - 1000)) + 1000}`;
  }
}

function generateBusinessHours(industry) {
  const hoursPatterns = {
    restaurant: 'Mon-Sun: 11:00 AM - 11:00 PM',
    retail: 'Mon-Sat: 10:00 AM - 9:00 PM, Sun: 12:00 PM - 7:00 PM',
    health: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
    beauty: 'Tue-Sun: 10:00 AM - 8:00 PM, Closed Mondays',
    tech: 'Mon-Fri: 9:00 AM - 6:00 PM',
    default: 'Mon-Sat: 9:00 AM - 7:00 PM'
  };
  return hoursPatterns[industry] || hoursPatterns.default;
}

function generateTrendingKeywords(industry, location) {
  const baseKeywords = {
    restaurant: ['food delivery', 'outdoor dining', 'fresh ingredients', 'chef specials'],
    tech: ['AI solutions', 'digital transformation', 'cloud services', 'cybersecurity'],
    retail: ['sustainable fashion', 'local brands', 'personalized shopping', 'eco-friendly'],
    health: ['telemedicine', 'preventive care', 'wellness programs', 'health screening'],
    beauty: ['organic treatments', 'anti-aging', 'natural skincare', 'beauty wellness'],
    default: ['local business', 'customer service', 'quality products', 'trusted brand']
  };
  
  const keywords = [...(baseKeywords[industry] || baseKeywords.default)];
  keywords.push(`${location} business`);
  keywords.push("customer reviews");
  
  // Shuffle and return random selection
  const shuffled = keywords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(4, shuffled.length));
}

function generateSeoTips(industry) {
  const tipsByIndustry = {
    restaurant: [
      "Optimize for 'near me' searches with local keywords",
      "Showcase customer reviews and food photos",
      "Create content around seasonal menus and events",
      "Use schema markup for restaurant information"
    ],
    tech: [
      "Focus on industry-specific technical keywords",
      "Create thought leadership content and case studies",
      "Optimize for B2B search terms and solutions",
      "Build authority with expert interviews and insights"
    ],
    retail: [
      "Optimize product pages with detailed descriptions",
      "Use local inventory and 'in-stock' keywords",
      "Create seasonal and trend-based content",
      "Implement customer review schema markup"
    ],
    default: [
      "Claim and optimize your Google Business Profile",
      "Encourage customers to leave authentic reviews",
      "Use location-based keywords in your content",
      "Ensure your website is mobile-friendly and fast"
    ]
  };
  
  return tipsByIndustry[industry] || tipsByIndustry.default;
}

function randomBetween(min, max, decimals = 0) {
  const random = Math.random() * (max - min) + min;
  return decimals > 0 ? parseFloat(random.toFixed(decimals)) : Math.floor(random);
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Validation middleware
const validateBusinessData = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Business name must be between 1 and 100 characters')
    .escape(),
  body('location')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Location must be between 1 and 100 characters')
    .escape()
];

const validateHeadlineParams = [
  query('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Business name must be between 1 and 100 characters')
    .escape(),
  query('location')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Location must be between 1 and 100 characters')
    .escape()
];

// Routes
app.get('/api/', (req, res) => {
  res.json({ message: "Enhanced Business SEO Dashboard API" });
});

app.post('/api/business-data', validateBusinessData, (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        detail: errors.array()[0].msg 
      });
    }

    const { name, location } = req.body;

    // Industry and location analysis
    const industry = detectIndustry(name);
    const locationType = getLocationType(location);

    // Generate industry-appropriate rating
    const ratingRanges = {
      restaurant: [3.8, 4.9],
      health: [4.2, 4.9],
      beauty: [4.0, 4.8],
      tech: [4.1, 4.7],
      retail: [3.9, 4.6],
      default: [3.5, 4.8]
    };
    const [minRating, maxRating] = ratingRanges[industry] || ratingRanges.default;
    const rating = randomBetween(minRating, maxRating, 1);

    // Generate location and industry-appropriate review count
    const reviewMultipliers = {
      metro: [200, 800],
      international: [150, 600],
      small_town: [30, 250]
    };
    const [minReviews, maxReviews] = reviewMultipliers[locationType];
    const reviews = randomBetween(minReviews, maxReviews);

    // Generate headline
    const headlineTemplates = INDUSTRY_HEADLINES[industry] || INDUSTRY_HEADLINES.default;
    const headlineTemplate = randomChoice(headlineTemplates);
    const headline = headlineTemplate.replace(/{name}/g, name).replace(/{location}/g, location);

    // Generate additional business data
    const phone = generatePhoneNumber(location);
    const website = `www.${name.toLowerCase().replace(/\s+/g, '').replace(/&/g, 'and')}.com`;
    const businessHours = generateBusinessHours(industry);

    // Social media metrics (varies by industry)
    const socialRanges = {
      beauty: [500, 5000],
      restaurant: [300, 3000],
      retail: [800, 8000],
      tech: [200, 2000],
      default: [100, 1500]
    };
    const [socialMin, socialMax] = socialRanges[industry] || socialRanges.default;

    const socialMetrics = {
      facebook_followers: randomBetween(socialMin, socialMax),
      instagram_followers: randomBetween(socialMin * 2, socialMax * 2),
      twitter_followers: randomBetween(Math.floor(socialMin / 2), Math.floor(socialMax / 2)),
      engagement_rate: randomBetween(2.5, 8.5, 1)
    };

    // Generate competitor insights
    const competitorNames = [
      `${randomChoice(['Elite', 'Premium', 'Royal', 'Golden', 'Superior'])} ${randomChoice(['Solutions', 'Services', 'Group', 'Associates', 'Enterprises'])}`,
      `${randomChoice(['Metro', 'Central', 'Prime', 'First', 'Top'])} ${randomChoice(['Hub', 'Center', 'Plaza', 'Point', 'Zone'])}`
    ];

    const competitorInsights = [
      {
        competitor_name: competitorNames[0],
        rating_difference: randomBetween(-0.5, 0.8, 1),
        review_difference: randomBetween(-150, 200)
      },
      {
        competitor_name: competitorNames[1],
        rating_difference: randomBetween(-0.3, 0.6, 1),
        review_difference: randomBetween(-100, 150)
      }
    ];

    // Generate trending keywords and SEO tips
    const trendingKeywords = generateTrendingKeywords(industry, location);
    const seoTips = generateSeoTips(industry);

    // Generate sentiment score and other metrics
    const sentimentScore = randomBetween(7.5, 9.5, 1);

    const peakHoursOptions = [
      "Lunch: 12-2 PM, Dinner: 7-9 PM",
      "Morning: 9-11 AM, Evening: 5-7 PM",
      "Afternoon: 2-4 PM, Evening: 6-8 PM",
      "Weekend: 11 AM-3 PM"
    ];
    const peakHours = randomChoice(peakHoursOptions);

    const priceRanges = {
      restaurant: randomChoice(['$', '$$', '$$$']),
      beauty: randomChoice(['$$', '$$$']),
      health: '$$$',
      tech: 'Enterprise',
      retail: randomChoice(['$', '$$']),
      default: '$$'
    };
    const priceRange = priceRanges[industry] || priceRanges.default;

    const response = {
      rating,
      reviews,
      headline,
      industry: industry.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      business_hours: businessHours,
      phone,
      website,
      social_metrics: socialMetrics,
      competitor_insights: competitorInsights,
      trending_keywords: trendingKeywords,
      seo_tips: seoTips,
      sentiment_score: sentimentScore,
      peak_hours: peakHours,
      price_range: priceRange
    };

    res.json(response);
  } catch (error) {
    console.error('Error in business-data endpoint:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.get('/api/regenerate-headline', validateHeadlineParams, (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        detail: errors.array()[0].msg 
      });
    }

    const { name, location } = req.query;

    const industry = detectIndustry(name);
    const headlineTemplates = INDUSTRY_HEADLINES[industry] || INDUSTRY_HEADLINES.default;
    const headlineTemplate = randomChoice(headlineTemplates);
    const headline = headlineTemplate.replace(/{name}/g, name).replace(/{location}/g, location);

    res.json({ headline });
  } catch (error) {
    console.error('Error in regenerate-headline endpoint:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ detail: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ detail: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Business SEO Dashboard API running on port ${PORT}`);
  console.log(`📊 Enhanced features: Industry detection, competitor analysis, social metrics`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;