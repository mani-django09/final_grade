# Final Grade Calculators - Complete Code Documentation

## Project Overview

**Final Grade Calculators** is a professional, SEO-optimized web application built with **Next.js (React 19)**, **Express.js**, **tRPC**, **Tailwind CSS 4**, and **Drizzle ORM**. The application provides two powerful grade calculation tools for students.

**Domain:** finalgradecalculators.us

---

## 🏗️ Project Structure

```
grade-calculator/
├── client/                          # Frontend (React 19 + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Final Grade Calculator page
│   │   │   ├── GradeCalculator.tsx # Overall Grade Calculator page
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── DashboardLayout.tsx # Dashboard layout (optional)
│   │   │   ├── ErrorBoundary.tsx   # Error handling
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx    # Theme management
│   │   ├── hooks/
│   │   │   └── useAuth.ts          # Authentication hook
│   │   ├── lib/
│   │   │   └── trpc.ts             # tRPC client
│   │   ├── App.tsx                 # Main router
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── public/                      # Static assets
│   └── index.html                  # HTML template
│
├── server/                          # Backend (Express.js + tRPC)
│   ├── routers.ts                  # tRPC procedure definitions
│   ├── db.ts                       # Database query helpers
│   ├── grades.test.ts              # Grade calculation tests
│   ├── auth.logout.test.ts         # Auth tests
│   └── _core/                      # Framework internals
│       ├── index.ts                # Server entry point
│       ├── context.ts              # tRPC context
│       ├── trpc.ts                 # tRPC setup
│       ├── env.ts                  # Environment variables
│       └── ...
│
├── drizzle/                         # Database
│   └── schema.ts                   # Database schema
│
├── shared/                          # Shared types/constants
│   ├── const.ts                    # Constants
│   └── types.ts                    # Shared types
│
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── drizzle.config.ts               # Drizzle config
```

---

## 🎨 Frontend Architecture

### Pages

#### 1. **Home.tsx** - Final Grade Calculator
**Purpose:** Calculate the grade needed on a final exam to achieve a desired course grade.

**Key Features:**
- Input fields: Current Grade, Final Exam Weight, Desired Grade
- Real-time calculation using tRPC
- Visual feedback with gradient backgrounds
- Status indicator (achievable/not achievable)
- Professional card-based UI
- Sticky header with navigation
- SEO-optimized with JSON-LD schemas
- Responsive design for all devices

**Key Components:**
```tsx
- Header with logo and navigation
- Hero section with gradient background
- Input card (left side)
- Result card (right side, sticky)
- Features section
- CTA section linking to Grade Calculator
- SEO content section
- Footer with multiple sections
```

**API Integration:**
```tsx
const { data: result, isLoading } = trpc.grades.calculateFinalGrade.useQuery({
  currentGrade,
  finalExamWeight,
  desiredGrade,
});
```

---

#### 2. **GradeCalculator.tsx** - Overall Grade Calculator
**Purpose:** Calculate overall course grade from multiple assignments with flexible weighting.

**Key Features:**
- Dynamic input rows for assignments
- Add/Remove grade entries
- Real-time overall grade calculation
- Letter grade display (A, B, C, D, F)
- Weight validation
- Sticky result card
- Professional UI with gradient backgrounds
- SEO-optimized with JSON-LD schemas

**Key Components:**
```tsx
- Header with logo and navigation
- Hero section
- Input section (left side)
  - Dynamic grade entry rows
  - Add/Remove buttons
  - Weight validation warning
- Result section (right side, sticky)
  - Overall grade display
  - Letter grade
  - Summary statistics
- CTA section linking to Final Grade Calculator
- SEO content section
- Footer
```

**API Integration:**
```tsx
const { data: result, isLoading } = trpc.grades.calculateOverallGrade.useQuery({
  grades: grades.map((g) => ({
    grade: g.grade,
    weight: g.weight,
  })),
});
```

---

### Styling & Design

**Technology Stack:**
- **Tailwind CSS 4:** Utility-first CSS framework
- **shadcn/ui:** Pre-built React components
- **Custom Gradients:** Blue/cyan gradient theme

**Color Scheme:**
- Primary: Blue (#3B82F6)
- Secondary: Cyan (#06B6D4)
- Background: Slate-900 to Slate-950
- Accent: Blue-400 to Cyan-400

**Key Design Elements:**
- Gradient backgrounds with blur effects
- Sticky headers for better UX
- Hover effects and transitions
- Responsive grid layouts
- Professional card designs
- Smooth animations

---

## 🔧 Backend Architecture

### tRPC Routers (`server/routers.ts`)

#### 1. **grades.calculateFinalGrade**
**Type:** Public Procedure (Query)

**Input:**
```ts
{
  currentGrade: number;      // 0-100
  finalExamWeight: number;   // 0-100
  desiredGrade: number;      // 0-100
}
```

**Output:**
```ts
{
  requiredGrade: number;     // Grade needed on final exam
  isAchievable: boolean;     // Whether goal is achievable
  message: string;           // Human-readable message
}
```

**Logic:**
```
Formula: requiredGrade = (desiredGrade - currentGrade * (100 - finalExamWeight)) / finalExamWeight

If requiredGrade > 100: Not achievable
If requiredGrade < 0: Already achieved
Otherwise: Show required grade
```

---

#### 2. **grades.calculateOverallGrade**
**Type:** Public Procedure (Query)

**Input:**
```ts
{
  grades: Array<{
    grade: number;         // 0-100
    weight: number;        // 0-100
  }>
}
```

**Output:**
```ts
{
  overallGrade: number;    // Weighted average
  weightedSum: number;     // Sum of weighted grades
}
```

**Logic:**
```
Formula: overallGrade = Σ(grade * weight) / Σ(weight)

Handles:
- Empty grades array
- Weights that don't sum to 100
- Decimal precision
```

---

#### 3. **auth.me**
**Type:** Public Procedure (Query)
**Returns:** Current user object or null

---

#### 4. **auth.logout**
**Type:** Public Procedure (Mutation)
**Action:** Clears session cookie and logs out user

---

### Database Schema (`drizzle/schema.ts`)

```ts
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
```

**Note:** Grade calculations are stateless and don't require database storage.

---

### Testing (`server/grades.test.ts`)

**Test Suite:** 14 tests covering all calculation scenarios

**Test Cases:**
1. Final grade calculation - achievable goal
2. Final grade calculation - not achievable goal
3. Final grade calculation - already achieved
4. Final grade calculation - edge cases (0%, 100%)
5. Overall grade calculation - basic
6. Overall grade calculation - unequal weights
7. Overall grade calculation - single grade
8. Overall grade calculation - multiple grades
9. Overall grade calculation - decimal precision
10. Overall grade calculation - edge cases

**Running Tests:**
```bash
pnpm test
```

---

## 🌐 SEO Implementation

### JSON-LD Schemas

Both pages include comprehensive JSON-LD schemas for SEO:

#### 1. **WebApplication Schema**
```json
{
  "@context": "https://schema.org/",
  "@type": "WebApplication",
  "name": "Final Grade Calculator",
  "description": "Calculate the grade you need on your final exam...",
  "url": "https://finalgradecalculators.us",
  "applicationCategory": "EducationalApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

#### 2. **BreadcrumbList Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://finalgradecalculators.us"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Final Grade Calculator",
      "item": "https://finalgradecalculators.us"
    }
  ]
}
```

#### 3. **FAQPage Schema**
Includes 4 common questions with answers about grade calculations.

---

### Content Optimization

**Homepage (900+ words):**
- H1: "Calculate Your Final Grade Instantly"
- H2 sections: What Is a Final Grade Calculator, How Does It Work, Tips for Improving
- Meta description: "Calculate the grade you need on your final exam to achieve your desired course grade"
- Internal links to Grade Calculator page

**Grade Calculator Page (900+ words):**
- H1: "Calculate Your Overall Grade"
- H2 sections: Understanding Course Grade Calculation, Key Features, Tips for Improving
- Meta description: "Calculate your overall course grade based on multiple assignments and their weights"
- Internal links to Final Grade Calculator page

---

## 🚀 Deployment & Configuration

### Environment Variables

**Pre-configured System Envs:**
- `DATABASE_URL`: MySQL/TiDB connection string
- `JWT_SECRET`: Session cookie signing secret
- `VITE_APP_ID`: Manus OAuth application ID
- `OAUTH_SERVER_URL`: Manus OAuth backend URL
- `VITE_OAUTH_PORTAL_URL`: Manus login portal URL
- `VITE_APP_TITLE`: Website title
- `VITE_APP_LOGO`: Website logo URL

### Build & Run

**Development:**
```bash
pnpm dev
```

**Build:**
```bash
pnpm build
```

**Start Production:**
```bash
pnpm start
```

**Run Tests:**
```bash
pnpm test
```

**Database Migration:**
```bash
pnpm db:push
```

---

## 📱 Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile-First Approach:**
- All components designed for mobile first
- Responsive grid layouts (1 column → 2 columns → 3 columns)
- Touch-friendly button sizes
- Readable font sizes on all devices

---

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels on form inputs
- Keyboard navigation support
- Focus indicators on interactive elements
- Color contrast compliance (WCAG AA)
- Screen reader friendly

---

## 🔐 Security

- **Authentication:** Manus OAuth integration
- **Session Management:** Secure HTTP-only cookies
- **Input Validation:** Type-safe tRPC procedures
- **XSS Protection:** React's built-in XSS prevention
- **CSRF Protection:** Same-site cookie policy

---

## 📊 Performance Optimizations

- **Code Splitting:** Lazy-loaded pages
- **Image Optimization:** Gradient backgrounds (no images)
- **CSS Optimization:** Tailwind CSS purging unused styles
- **Bundle Size:** Minimal dependencies
- **Caching:** Browser caching for static assets
- **API Optimization:** Real-time queries with tRPC

---

## 🎯 Key Features Summary

### Final Grade Calculator
✅ Real-time calculation
✅ Visual feedback (achievable/not achievable)
✅ Decimal precision
✅ Responsive design
✅ Professional UI
✅ SEO optimized
✅ Sticky result card

### Grade Calculator
✅ Dynamic grade entries
✅ Flexible weighting
✅ Add/Remove rows
✅ Weight validation
✅ Letter grade display
✅ Summary statistics
✅ Responsive design
✅ Professional UI
✅ SEO optimized

---

## 🔄 Data Flow

### Frontend → Backend Flow

```
User Input (React State)
    ↓
tRPC Query/Mutation
    ↓
Server Router (tRPC Procedure)
    ↓
Calculation Logic
    ↓
Return Result
    ↓
Update React State
    ↓
Re-render UI
```

### Example: Final Grade Calculation

```tsx
// Frontend
const { data: result } = trpc.grades.calculateFinalGrade.useQuery({
  currentGrade: 85,
  finalExamWeight: 25,
  desiredGrade: 90,
});

// Backend
calculateFinalGrade: publicProcedure
  .input(z.object({
    currentGrade: z.number().min(0).max(100),
    finalExamWeight: z.number().min(0).max(100),
    desiredGrade: z.number().min(0).max(100),
  }))
  .query(({ input }) => {
    const { currentGrade, finalExamWeight, desiredGrade } = input;
    const requiredGrade = 
      (desiredGrade - currentGrade * (100 - finalExamWeight)) / finalExamWeight;
    // ... return result
  })
```

---

## 📝 File Locations

### Key Source Files

**Frontend Pages:**
- `/client/src/pages/Home.tsx` - Final Grade Calculator
- `/client/src/pages/GradeCalculator.tsx` - Overall Grade Calculator
- `/client/src/App.tsx` - Router configuration

**Backend Logic:**
- `/server/routers.ts` - tRPC procedures
- `/server/db.ts` - Database helpers
- `/server/grades.test.ts` - Grade calculation tests

**Configuration:**
- `/package.json` - Dependencies and scripts
- `/tsconfig.json` - TypeScript configuration
- `/vite.config.ts` - Vite configuration
- `/drizzle.config.ts` - Database configuration

**Styling:**
- `/client/src/index.css` - Global styles and Tailwind config
- `/client/src/components/ui/` - shadcn/ui components

---

## 🛠️ Development Workflow

### Adding a New Feature

1. **Update Schema** (if needed):
   ```bash
   # Edit drizzle/schema.ts
   pnpm db:push
   ```

2. **Add Database Helper** (if needed):
   ```ts
   // server/db.ts
   export async function getFeatureData() { ... }
   ```

3. **Create tRPC Procedure**:
   ```ts
   // server/routers.ts
   feature: publicProcedure.query(({ ctx }) => { ... })
   ```

4. **Build Frontend Component**:
   ```tsx
   // client/src/pages/Feature.tsx
   const { data } = trpc.feature.useQuery();
   ```

5. **Add Tests**:
   ```ts
   // server/feature.test.ts
   describe("feature", () => { ... })
   ```

6. **Run Tests**:
   ```bash
   pnpm test
   ```

---

## 📞 Support & Maintenance

### Common Issues

**Issue:** Calculation not updating
**Solution:** Ensure input values are properly bound to state

**Issue:** Styling looks off
**Solution:** Clear browser cache and rebuild with `pnpm build`

**Issue:** Tests failing
**Solution:** Check input validation in tRPC procedures

---

## 🎓 Learning Resources

- **tRPC:** https://trpc.io
- **Tailwind CSS:** https://tailwindcss.com
- **React 19:** https://react.dev
- **shadcn/ui:** https://ui.shadcn.com
- **Drizzle ORM:** https://orm.drizzle.team

---

## 📄 License

MIT License - Free for educational and commercial use

---

**Last Updated:** November 29, 2024
**Version:** 6518c79f
**Domain:** finalgradecalculators.us
