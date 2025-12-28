# UI Foundations Documentation

## About
This is a **documentation-only** page that catalogs existing UI patterns in the Oshiya product.

**Important:** This page does NOT modify, replace, or affect any existing screens. All current UI remains visually identical.

## Accessing the Page

The UI Foundations page is accessible via browser console to keep it separate from production UI:

1. Open your browser's Developer Console (F12 or Cmd+Option+J)
2. Run this command:
```javascript
oshiyaNavigate("ui-foundations")
```

## What's Documented

### Foundations
- **Colors**: Purple gradient, gray scale, primary and secondary colors
- **Border Radius**: Common radius patterns (lg, xl, 2xl, 3xl)
- **Spacing**: Padding and margin patterns used throughout

### Controls
- **Primary Button**: Main action button with purple background
- **Secondary Button**: Ghost button style for close buttons
- **Toggle Switch**: Improved toggle used in Settings
- **Radio Button**: Custom radio button with gray/black states
- **Text Input**: Two variants (border-1 and border-2)

### Chat Components
- **Assistant Message Bubble**: Purple-to-pink gradient bubble
- **User Message Bubble**: White bubble with purple border
- **Quick Reply Buttons**: Semi-transparent buttons inside chat

### Navigation
- **Tabs**: Active/inactive tab states

### Containers
- **Card**: White card with border and shadow

### Icons & Emojis
- **Icons**: lucide-react outline style
- **Emojis**: Used for personality in chat

## Purpose

This page serves as:
1. A visual reference for developers
2. A style guide for future components
3. Documentation of current patterns for consistency

## Future Use

Components documented here can be gradually extracted and used systematically when refactoring, but only when explicitly chosen - never automatically applied.
