# TODO: Rebuild FAQ & Support Page

## Overview
Rebuild FaqSupport.jsx to be simple, modern, and dynamic with the specified design goals.

## Tasks
- [ ] Update page layout: one-column on mobile, two-column on desktop (FAQ left, Quick Help right)
- [ ] Implement page header with H1 "FAQ & Support", subtext, and subtle fade-in animation
- [ ] Enhance search: full-width input, debounced filter, empty state card
- [ ] Refactor FAQ accordions: use reusable <AccordionItem>, ensure only one open at a time, smooth transitions, keyboard accessibility
- [ ] Update Quick Help: card with buttons, sticky on desktop (top: 96px), remove extra resources
- [ ] Verify Support modal: fields, validation, success toast, POST to stub /api/support
- [ ] Apply visual styles: Tailwind classes, cards, spacing, hover/focus states
- [ ] Add motion: fade/slide-up on sections, accordion height + opacity transitions
- [ ] Ensure data structure matches spec: FAQs array with group, q, a
- [ ] Remove unused components/styles, group icons, and old FAQ references
- [ ] Add optional dark mode support (respects prefers-color-scheme)
- [ ] Lint and format the code
- [ ] Test performance: no blocking images, lightweight

## Acceptance Criteria
- Clean, minimal layout; fast search; smooth, accessible accordions
- Works beautifully on mobile and desktop with sticky Quick Help
- Support modal validates and shows success toast
- No text mentions "AI"
