# CLAUDE.md - AI Assistant Guide for Dr-He AI Face Analysis

## Project Overview

Dr-He AI Face Analysis (Aura AI) is a Chinese-language web application that uses Google's Gemini 2.5 Flash model to provide AI-powered facial and skin analysis. Users upload face photos and receive personalized aesthetic and health insights across three dimensions:
- **肤色 (Skin Tone)**: Detects skin issues like spots, acne, scars
- **气色 (Complexion)**: Evaluates skin vitality, dryness, aging signs
- **形色 (Facial Form)**: Analyzes 8 facial regions for aesthetic harmony

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 19.1.1 |
| Language | TypeScript | 5.8.2 |
| Build Tool | Vite | 6.2.0 |
| Styling | Tailwind CSS | 4.x (Build) |
| Testing | Vitest + Playwright | Latest |
| Code Quality | ESLint + Prettier | Latest |
| AI Service | Google Gemini | 2.5 Flash |
| Markdown | react-markdown + remark-gfm | 9.0.1 |
| Export | html2canvas | 1.4.1 |

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Code quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format with Prettier

# Testing
npm run test          # Run unit tests (watch mode)
npm run test:run      # Run unit tests once
npm run test:coverage # Run tests with coverage
npm run test:e2e      # Run E2E tests with Playwright
npm run test:e2e:ui   # Run E2E tests with UI
```

## Environment Setup

Create `.env.local` in the project root:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

The API key is injected at build time via `vite.config.ts` and accessed as `process.env.GEMINI_API_KEY`.

## Directory Structure

```
/home/user/doctor-he/
├── components/              # React UI components
│   ├── AIChat.tsx          # AI conversation interface
│   ├── AnalysisResult.tsx  # Analysis results display
│   ├── ErrorBoundary.tsx   # Error handling wrapper
│   ├── ImageUploader.tsx   # Image upload and camera capture
│   ├── Modal.tsx           # Reusable modal dialog
│   ├── Settings.tsx        # User preferences
│   ├── Skeleton.tsx        # Loading skeleton components
│   └── ...                 # Other UI components
├── services/
│   └── geminiService.ts    # Gemini API integrations
├── utils/
│   ├── imageCompression.ts # Image compression utilities
│   ├── rateLimiter.ts      # API rate limiting
│   └── lazyImport.tsx      # Lazy loading utilities
├── tests/                   # Unit tests
│   ├── setup.ts            # Test setup
│   └── components/         # Component tests
├── e2e/                     # E2E tests (Playwright)
│   └── app.spec.ts         # App E2E tests
├── src/
│   └── index.css           # Tailwind CSS entry point
├── public/
│   └── manifest.json       # PWA manifest
├── App.tsx                 # Main application component
├── index.tsx               # React DOM entry point
├── types.ts                # TypeScript type definitions
├── vite.config.ts          # Vite + PWA configuration
├── vitest.config.ts        # Vitest configuration
├── playwright.config.ts    # Playwright configuration
├── tailwind.config.js      # Tailwind configuration
├── eslint.config.js        # ESLint configuration
└── package.json            # Dependencies and scripts
```

## Architecture Patterns

### State Management
- **React hooks**: `useState`, `useEffect`, `useCallback`, `useRef`
- **No external state library**: State is managed locally in components
- **localStorage**: Persists user settings (`appSettings` key) and first-visit flag (`hasVisitedAuraAI`)

### Data Flow
1. User uploads image via `ImageUploader`
2. `App.tsx` handles `handleImageReady()` callback
3. Image sent to `geminiService.analyzeImage()` as base64
4. Response parsed into `AnalysisReport` type
5. `AnalysisResult` component renders the findings

### View Navigation
Three main views managed by state in `App.tsx`:
- `main` - Image upload and analysis results
- `chat` - AI assistant conversation
- `settings` - User preferences

### Service Layer
`services/geminiService.ts` centralizes all AI interactions:
- `analyzeImage()` - Primary image analysis
- `sendMessageToChat()` - AI conversation
- `getExplanationForTerm()` - Explain terminology
- `generateSuggestedQuestions()` - Follow-up prompts
- `resetChat()` - Clear chat history

## Key Type Definitions

Located in `types.ts`:

```typescript
// Main analysis result structure
interface AnalysisReport {
  肤色: AnalysisSection;    // Skin tone analysis
  气色: AnalysisSection;    // Complexion analysis
  形色: FormAnalysisSection; // Facial form analysis
}

// Settings stored in localStorage
interface AppSettings {
  theme: Theme;
  fontSize: FontSize;
  aiPersonality: AIPersonalitySettings;
}

// View types
type MainTab = 'upload' | 'result';
type View = 'main' | 'chat' | 'settings';
type Theme = 'light' | 'dark' | 'roseGold' | 'lilac' | 'mint';
type FontSize = 'small' | 'medium' | 'large';
```

## Code Conventions

### Naming
- **Components**: PascalCase (`ImageUploader.tsx`)
- **Functions**: camelCase (`handleImageReady`, `analyzeImage`)
- **Constants**: UPPER_SNAKE_CASE (`FIRST_VISIT_KEY`)
- **Types/Interfaces**: PascalCase (`AnalysisReport`, `ChatMessage`)

### Component Structure
```typescript
// Props interface defined above component
interface MyComponentProps {
  prop1: string;
  onAction: () => void;
}

// Functional component with FC type
const MyComponent: React.FC<MyComponentProps> = ({ prop1, onAction }) => {
  // Hooks at top
  const [state, setState] = useState<Type>(initial);
  const ref = useRef<HTMLDivElement>(null);

  // Handlers
  const handleClick = useCallback(() => {
    // ...
  }, [dependencies]);

  // Effects
  useEffect(() => {
    // ...
    return () => { /* cleanup */ };
  }, []);

  // Render
  return <div>...</div>;
};

export default MyComponent;
```

### TypeScript
- Strict null checks enabled
- Export interfaces from `types.ts`
- Use const assertions for readonly arrays
- Avoid `any` - use proper typing

### Styling with Tailwind
- Use utility classes directly in JSX
- Theme colors via CSS variables: `--color-background`, `--color-primary`, etc.
- Responsive: `sm:`, `md:`, `lg:` prefixes
- Custom theme classes defined in `index.html`

### Accessibility
- ARIA labels on icon buttons
- Keyboard navigation (Escape closes modals)
- Focus management in modals
- `role` attributes on dialogs

## Theme System

5 themes defined in `index.html` via CSS custom properties:

| Theme | CSS Class | Background | Primary |
|-------|-----------|------------|---------|
| Light | `.theme-light` | #F8F7F5 | #A7C4BC |
| Dark | `.theme-dark` | #1C1C1E | #A7C4BC |
| Rose Gold | `.theme-roseGold` | #FDF5EF | #E4AAA3 |
| Lilac | `.theme-lilac` | #F7F5FA | #B5AAE4 |
| Mint | `.theme-mint` | #F2F9F8 | #7BC8B8 |

Switch themes by changing the class on the root element.

## Common Development Tasks

### Adding a New Component
1. Create file in `components/` with PascalCase name
2. Define props interface
3. Export default functional component
4. Import and use in parent component

### Adding a New Gemini API Call
1. Add method to `services/geminiService.ts`
2. Define request/response types in `types.ts`
3. Use existing patterns for error handling and model configuration

### Modifying Analysis Output
1. Update `AnalysisReport` interface in `types.ts`
2. Modify prompt in `geminiService.analyzeImage()`
3. Update `AnalysisResult.tsx` to display new fields

### Adding User Settings
1. Update `AppSettings` interface in `types.ts`
2. Add UI controls in `Settings.tsx`
3. Handle in `App.tsx` state and localStorage

## Important Considerations

### Chinese Localization
- All UI text is in Simplified Chinese
- Analysis categories use Chinese keys (`肤色`, `气色`, `形色`)
- Font: "Noto Sans SC" for proper Chinese character rendering

### No Test Framework
- Currently no tests configured
- Vitest would be the natural choice for this Vite project
- React Testing Library for component tests

### No Linting
- ESLint not configured
- TypeScript strict mode provides some checking
- Consider adding ESLint + Prettier for consistency

### API Key Security
- API key is embedded at build time
- For production, consider proxy/backend to protect key

### Performance Notes
- Use `useCallback` for handlers passed to children
- Use `useRef` for DOM references
- Clean up subscriptions/observers in useEffect returns

## Files to Read First

When onboarding to this codebase:
1. `types.ts` - Understand all data structures
2. `App.tsx` - Main application flow
3. `services/geminiService.ts` - AI integration
4. `components/ImageUploader.tsx` - Core input component
5. `components/AnalysisResult.tsx` - Core output component

## Git Workflow

- Feature branches: `feature/description`
- Commit messages: Descriptive, in English
- PR workflow documented in README.md

## Troubleshooting

### API Key Issues
- Ensure `.env.local` exists with `GEMINI_API_KEY`
- Restart dev server after changing env vars
- Check Vite console for injection errors

### Build Errors
- Run `npm install` to ensure all dependencies
- Check TypeScript errors: strict mode is enabled
- Verify all imports resolve correctly

### Styling Issues
- Tailwind is loaded via CDN in `index.html`
- Custom theme must be applied to root element
- Check CSS variable definitions match theme class

## Contact

Developed by: 重庆联合丽格科技有限公司 (Chongqing United Lege Technology Co., Ltd.)
