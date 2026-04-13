# Quote System

**Directory:** `src/lib/quotes/`
**Total Quotes:** 997
**Index:** `src/lib/quotes/index.ts`

## Architecture
```
quotes/index.ts
    imports from 10 category files
    exports allQuotes (combined array)
    re-exports individual category arrays
```

## Categories

| File | Export Name | Count | Content |
|------|-----------|-------|---------|
| athletes.ts | `athleteQuotes` | 100 | Serena Williams, Simone Biles, Mary Kom, PV Sindhu, Billie Jean King, etc. |
| poets.ts | `poetQuotes` | 97 | Maya Angelou, Emily Dickinson, Sylvia Plath, Virginia Woolf, Kamala Das, Sarojini Naidu, etc. |
| leaders.ts | `leaderQuotes` | 92 | Malala, Rosa Parks, Eleanor Roosevelt, Indira Gandhi, RBG, Angela Merkel, etc. |
| scientists.ts | `scientistQuotes` | 90 | Marie Curie, Kalpana Chawla, Jane Goodall, Grace Hopper, Jennifer Doudna, etc. |
| business.ts | `businessQuotes` | 100 | Oprah, Coco Chanel, Indra Nooyi, Frida Kahlo, Beyonce, etc. |
| activists.ts | `activistQuotes` | 81 | Greta Thunberg, Mother Teresa, bell hooks, Angela Davis, Wangari Maathai, etc. |
| indian.ts | `indianQuotes` | 98 | Sudha Murty, Lata Mangeshkar, Savitribai Phule, Kiran Bedi, etc. |
| historical.ts | `historicalQuotes` | 100 | Joan of Arc, Florence Nightingale, Cleopatra, Helen Keller, Amelia Earhart, etc. |
| modern.ts | `modernQuotes` | 99 | Michelle Obama, Brene Brown, Shonda Rhimes, Priyanka Chopra, etc. |
| **bengali.ts** | `bengaliQuotes` | **140** | **Bengali script quotes from Begum Rokeya, Ashapurna Devi, Mahasweta Devi, Kamini Roy, Sufia Kamal, Aparna Sen, Jhulan Goswami, etc.** |

## Quote Interface
```typescript
interface Quote {
  text: string;       // The quote (Bengali quotes in Bengali script)
  author: string;     // English name
  role: string;       // English role description
  imageUrl: string;   // Wikipedia URL or ""
  gradient: string;   // Tailwind gradient ("from-X-400 to-Y-600")
  emoji: string;      // Contextual emoji
}
```

## Rotation Logic (Dashboard)
- Rotates every **10 seconds**
- Every **3rd tick** shows Bengali quotes
- Pattern: general, general, **Bengali**, general, general, **Bengali**...
- Separate index counters for general pool vs Bengali pool
- AnimatePresence fade transitions

## Quality Assurance
- **Reviewed by AI reviewer agent** (see QUOTE_REVIEW.md)
- Removed 9 quotes from men
- Fixed 12 misattributions
- Removed ~35 cross-file duplicates
- Bengali grammar verified

## Related
- [[Pages/Dashboard Page]]
- [[Data/Seed Data]]
- [[Quotes/Bengali Quotes]]
