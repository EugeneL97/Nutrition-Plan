# Bodybuilding Nutrition Plan App - Roadmap

## Vision
Build a robust, AI-assisted meal planning tool tailored for bodybuilders, with the flexibility to later adapt for the general population. The tool should provide precise, evidence-based macronutrient calculations, food preferences, and practical meal suggestions that support long-term adherence and progress.

## 1. Core Features (Bodybuilding Focus)

### Macronutrient Calculation
- **Protein**: Default to 1g/lb bodyweight (user input for bodyweight)
- **Fat**: Default to 0.3g/lb bodyweight (user input for bodyweight) 
- **Carbs**: Remainder of calories after protein and fat are set
- Allow user to override these defaults for advanced customization
- Support for different bodyweight units (lbs/kg)

### Meal Plan Generation
- Use Gemini AI to generate daily meal plans that hit the calculated macros
- Output both meal details and a summary of macros as JSON for easy verification
- Ensure the sum of meal macros matches the targets as closely as possible
- Generate shopping lists based on meal plans

### Food Preferences & Restrictions
- Allow users to specify preferred foods (e.g., potatoes for carbs, chicken for protein)
- AI should prioritize these foods in meal generation
- Suggest adjacent/related foods for variety (e.g., if user likes potatoes, suggest sweet potatoes, yams, etc.)
- Food exclusions due to allergies, intolerances, or dislikes
- **Low FODMAP defaults** to minimize digestive issues
- **Food database integration**:
  - Integrate with public food database APIs (USDA, Open Food Facts, Nutritionix)
  - Allow users to add custom foods/recipes
  - (Future) Build curated, verified food database for accuracy

### User Experience
- Simple, clean UI focused on bodybuilding needs
- Option to save, edit, and duplicate plans
- Ability to adjust macros and regenerate plans
- Mobile-responsive design for gym use

## 2. Advanced Features (Future)

### General Population Mode
- Add "lifestyle" options for broader use cases (e.g., casual gym-goer, busy professional)
- Adjust macro defaults and meal suggestions accordingly
- Simplified interface for non-bodybuilders

### Progress Tracking
- Log daily meals and track adherence
- Visualize progress toward goals (weight, macros, etc.)
- Weekly weight change tracking for calorie adjustments
- **Weekly refeed/cheat meal planning** triggered by:
  - Losing too much weight on a cut
  - Not gaining enough weight on a bulk

### Recipe Database
- Build a database of common bodybuilding recipes
- Allow users to add their own recipes
- Recipe sharing and community features

### Integration
- Export plans to fitness tracking apps (e.g., MyFitnessPal)
- Manual entry and CSV import for bodyweight/progress data
- Integration with training logs for context (but not dynamic calorie adjustments)
- **(Future) Import from fitness tracking apps** (MyFitnessPal, Fitbit, Apple Health, Google Fit)
- **(Future) Smart scale integration** (Withings, Eufy, Renpho)

## 3. Bodybuilding-Specific Features

### Meal Timing
- Option to emphasize peri-workout nutrition (pre/post-workout meals)
- Meal timing suggestions based on training schedule
- **Schedule-based recommendations**:
  - Consistent schedules: Standard meal timing and prep suggestions
  - Inconsistent schedules: Portable, shelf-stable, or reheatable meal recommendations
  - Onboarding questionnaire for work/life/training schedule

### Supplement Suggestions
- Recommend common supplements (e.g., whey, creatine) based on user goals
- Supplement timing recommendations
- **Micronutrient-driven recommendations**: Suggest supplements or food sources if diet is low in specific micronutrients
- Basic, evidence-based supplement suggestions (protein powder, creatine, fish oil, multivitamin, vitamin D)

### Contest Prep Mode
- Stricter macro control, more frequent meals, low-calorie options
- Contest prep timeline planning
- Peak week protocols

### Bulk vs. Cut Phases
- Adjust macro ratios and meal suggestions based on bulking or cutting phase
- **Protein recommendations by phase**:
  - Cutting: 1.2–1.5g/lb bodyweight protein
  - Maintenance/Bulking: 1.0g/lb bodyweight protein
- **High volume, low calorie food emphasis during cuts** (more veggies/fruit instead of rice)
- **Long-term roadmaps** for bulking/cutting/minicut/contest prep phases
- Suggested rate of loss or weight gain in long-term context

### Dieting Styles Support
- **Carb cycling** (high carbs on training days, or just on leg days, low carbs on rest days)
- **Non-carb cycling** (day to day doesn't change)
- **Intermittent fasting** protocols
- **Protein sparing fasts**
- **Standard day-to-day meal plans** that don't change

## 4. Health & Wellness Features

### Hydration & Electrolytes
- **Hydration reminders** based on activity level
- **Sodium recommendations** especially if sweating
- **Weather-based hydration suggestions** (eventually through geotagging, check weather and recommend more hydration if hot + humid)
- Electrolyte balance recommendations

### Meal Prep & Sustainability
- **Meal prep tips** to make dieting more sustainable and easier to adhere to
- **Scheduled meal prep reminders** (user-defined intervals: every 3 days, weekly, etc.)
- **Freezer vs. fridge prep recommendations**:
  - Freezer prep for large batches (e.g., 30lbs of protein, portioned and frozen)
  - Fridge prep for short-term consumption
  - Food safety and storage education
- Batch cooking suggestions
- Meal prep timeline planning
- Storage and reheating tips

### Digestion Support
- **Digestion helper** to figure out what users can tolerate and tailor suggestions
- Track food intolerances and reactions
- Suggest gut-friendly alternatives
- **Low FODMAP defaults** to minimize digestive issues

### Micronutrient Tracking
- **Comprehensive micronutrient tracking** (think Cronometer)
- Identify potential deficiencies
- Suggest foods to address micronutrient gaps
- Vitamin and mineral recommendations based on diet analysis

## 5. Technical Improvements

### AI Prompt Engineering
- Refine prompts to Gemini to ensure accurate macro matching and food preferences
- Parse and validate AI output, correcting discrepancies as needed
- Require AI to output meal plan and macro summary as JSON
- Implement macro verification after AI response

### Testing & Validation
- Add unit and integration tests for macro calculations and meal plan generation
- Validate that meal plans meet user-specified macros
- Test AI output parsing and error handling

### Performance & Scalability
- Optimize AI response times
- Cache common meal suggestions
- Implement progressive web app features

## 6. User Customization

### Macro Ratio Flexibility
- Allow users to shift ratios (e.g., higher protein, lower carbs) based on personal preference or tolerance
- Support for different dieting approaches (keto, high-carb, etc.)

### Personalization
- Learning algorithms to improve suggestions based on user preferences
- Custom food database for individual users
- Personalized supplement recommendations
- **Coach/Client Dashboard**:
  - Support for both individual and coach (multi-client) modes
  - Coach dashboard for managing multiple clients, assigning plans, and tracking progress
  - Individual mode for self-coached users

## 7. Data & Analytics

### Progress Analytics
- Weight tracking over time
- Macro adherence tracking
- Progress photos (optional)
- Body composition tracking

### Insights & Recommendations
- AI-powered insights based on progress data
- Automatic calorie adjustments based on weekly weight changes
- Plateau detection and suggestions

## 8. Community & Social Features

### Community Features
- Recipe sharing
- Progress sharing (optional)
- Community challenges
- Expert advice and Q&A

### Educational Content
- Nutrition education articles
- Training and nutrition guides
- Supplement education
- Contest prep guides

## Implementation Phases

### Phase 1: Core Foundation (Current)
- [x] Basic meal plan generation
- [x] User authentication
- [ ] Proper macro calculations (1g/lb protein, 0.3g/lb fat)
- [ ] Food preferences system
- [ ] AI JSON output parsing
- [ ] Food database integration (public API)
- [ ] Schedule-based meal timing recommendations
- [ ] Coach/Client dashboard architecture

### Phase 2: Bodybuilding Features
- [ ] Bulk/cut phase support with protein recommendations (1.2-1.5g/lb for cutting)
- [ ] Meal timing optimization
- [ ] Supplement recommendations (basic + micronutrient-driven)
- [ ] Progress tracking
- [ ] Hydration reminders
- [ ] Meal prep scheduling and storage recommendations

### Phase 3: Advanced Features
- [ ] Contest prep mode
- [ ] Carb cycling support
- [ ] Micronutrient tracking
- [ ] Weather-based hydration
- [ ] Digestion support

### Phase 4: Optimization & Scale
- [ ] Performance optimization
- [ ] Community features
- [ ] Educational content
- [ ] Advanced analytics
- [ ] Mobile app development

## Success Metrics
- User adherence to meal plans
- Progress toward body composition goals
- User retention and engagement
- Accuracy of AI-generated meal plans
- User satisfaction with macro calculations

## Future Considerations
- Integration with wearable devices
- AI-powered progress photo analysis
- Virtual coaching and consultation
- Integration with supplement retailers
- Advanced meal prep automation
