# Professional Expense Dashboard

A modern, professional expense tracking dashboard that integrates with Google Sheets for live data and provides comprehensive financial analytics.

## 🚀 Features

- **Live Google Sheets Integration** - Real-time data sync with your expense sheet
- **Comprehensive Analytics** - 7+ chart types and visualizations
- **Advanced Filtering** - Search, sort, and filter transactions
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Dark Theme** - Professional dark theme with glass morphism effects
- **Export Functionality** - Export filtered data as CSV
- **Real-time Updates** - Manual refresh with last updated timestamp

## 📊 Dashboard Components

### Summary Cards
- Total Spend
- Monthly Spend  
- Avoidable vs Essential Spend
- Top Category & Payment Mode

### Charts & Visualizations
1. **Category Donut Chart** - Spending breakdown by category
2. **Daily Stacked Bar Chart** - Daily spending with category breakdown
3. **Payment Mode Analysis** - Spending by payment method
4. **Avoidable vs Essential Comparison** - Category-wise avoidable spending
5. **Frequency Analysis** - Spending patterns by frequency
6. **Transaction Table** - Filterable, sortable transaction history

## 🔧 Setup Instructions

### 1. Google Sheets Setup

1. Create a Google Sheet with the following columns:
   ```
   Date | Mode | Category | Sub Category | For | Amount | Description | Priority | Avoidable | Frequency
   ```

2. **Publish your sheet to web:**
   - Go to `File → Share → Publish to web`
   - Choose `Comma-separated values (.csv)` format
   - Select `Entire Document`
   - Click `Publish`
   - Copy the generated URL

3. **Update the dashboard:**
   - Open `src/utils/fetchSheetData.ts`
   - Replace `YOUR_SHEET_ID` in the `SHEET_URL` with your sheet's URL

### 2. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 3. GitHub Pages Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/expense-dashboard.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to `Pages` section
   - Select source: `Deploy from a branch`
   - Choose branch: `main`
   - Choose folder: `/ (root)`
   - Click `Save`

3. **Configure for GitHub Pages:**
   - Update `vite.config.ts` with your repository name:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/expense-dashboard/', // Replace with your repo name
     build: {
       outDir: 'dist'
     }
   });
   ```

4. **Add GitHub Actions (Optional):**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## 📱 Data Structure

Your Google Sheet should have these columns:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| Date | Date | Transaction date | 2024-01-15 |
| Mode | Text | Payment method | Credit Card, Cash, UPI |
| Category | Text | Expense category | Food, Transport, Bills |
| Sub Category | Text | Subcategory | Restaurants, Fuel, Utilities |
| For | Text | Purpose | Dinner, Car, Electricity |
| Amount | Number | Amount spent | 45.50 |
| Description | Text | Transaction details | Italian restaurant |
| Priority | Text | Priority level | High, Medium, Low |
| Avoidable | Text | Can be avoided? | Yes, No |
| Frequency | Text | How often | Daily, Weekly, Monthly |

## 🎨 Technology Stack

- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom dark theme
- **Charts:** Chart.js with React wrapper
- **Data Processing:** PapaParse for CSV handling
- **Date Handling:** date-fns
- **Build Tool:** Vite
- **Hosting:** GitHub Pages

## 🔒 Privacy & Security

- No backend required - fully client-side
- Google Sheets data is read-only
- No personal data stored locally
- All processing happens in your browser

## 🚀 Future Enhancements

- [ ] Monthly budget comparison
- [ ] Expense predictions using trends
- [ ] Multiple sheet support
- [ ] PWA support for mobile app feel
- [ ] Advanced filtering with date ranges
- [ ] Custom category management
- [ ] Receipt upload integration

## 📄 License

MIT License - feel free to use and modify as needed.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.