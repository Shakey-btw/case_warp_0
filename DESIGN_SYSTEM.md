# Design System

This document outlines the design system for the Headcount Planning Tool.

## Colors

### Background
- **Primary Background**: `white`
- **Secondary Background**: `#F6F6F6` (for specific secondary sections or fillings of cards)

### Lines / Strokes
- **Stroke Color**: `#E0E0E0`
- **Stroke Width**: `1px`
- **Stroke Style**: `solid`
- Used for: buttons, separations, objects with just strokes

### Text Colors
- **Headings**: `black` (#000000)
- **Body texts and smaller**: `#525252`

## Buttons

### Corner Radius
- **Default**: `10px`

### Primary Button
- **Fill**: `#0A1111`
- **Padding**: 
  - Top/Bottom: `8px`
  - Left/Right: `16px`
- **Font**:
  - Color: `white`
  - Size: `15px` (or 16-18px for button label)
  - Line Height: `20px` (or 1.20-1.30)
  - Letter Spacing: `-0.3px` (or 0-0.01em)
  - Weight: `medium` (600)
- **Drop Shadow**: 
  - X: `0px`
  - Y: `2.5px`
  - Blur: `5px`
  - Spread: `-2.5px`
  - Color: `#000000` at `12%` opacity
- **Inner Shadow**:
  - X: `0px`
  - Y: `0px`
  - Blur: `5px`
  - Spread: `0px`
  - Color: `white` at `50%` opacity

### Secondary Button
- **Stroke**: `#E0E0E0`, `solid`, `1px`
- **Fill**: `white`
- **Font**: `black`, all other properties same as primary

## Typography

### Font Family
- **Primary**: `Inter`

### Headings

#### H1
- Size: `64px`
- Weight: `600`
- Line Height: `1.15`
- Letter Spacing: `-0.01em`

#### H2
- Size: `40px`
- Weight: `600`
- Line Height: `1.20`
- Letter Spacing: `-0.01em`

#### H3
- Size: `28px`
- Weight: `600`
- Line Height: `1.25`
- Letter Spacing: `0em`

#### Subhead
- Size: `20px`
- Weight: `500`
- Line Height: `1.35`
- Letter Spacing: `0em`

### Body and Supporting Text

#### Lead/Intro
- Size: `20px`
- Weight: `500`
- Line Height: `1.45`
- Letter Spacing: `0em`

#### Body
- Size: `16px`
- Weight: `500`
- Line Height: `1.60`
- Letter Spacing: `0-0.01em`

#### Small/Meta
- Size: `14px`
- Weight: `500`
- Line Height: `1.55`
- Letter Spacing: `0.01em`

#### Caption/Legal
- Size: `12-13px`
- Weight: `500`
- Line Height: `1.60-1.70`
- Letter Spacing: `0.02em`

### Interactive Text

#### Button Label (Primary)
- Size: `16-18px`
- Weight: `600`
- Line Height: `1.20-1.30`
- Letter Spacing: `0-0.01em`

#### Input/Placeholder
- Size: `16px`
- Weight: `500`
- Line Height: `1.50`
- Letter Spacing: `0.01em`

#### FAQ Question
- Size: `20px`
- Weight: `600`
- Line Height: `1.35`
- Letter Spacing: `0em`

#### Navigation Links
- Size: `16px`
- Weight: `500-600`
- Line Height: `1.35`
- Letter Spacing: `0-0.01em`

## Spacing and Measure

### Paragraph Spacing
- Short blurbs: `12-16px` below
- Stacked microcopy: `8-12px`

### Section Spacing
- Between major blocks: `56-96px`

### Measure (Line Width)
- Body: `≈ 60-75 chars`
- Subheads: `≈ 45-60 chars`
- Hero sublines: tighter

## Border Radius

### Bigger Boxes
- **Border Radius**: `12px`

## Implementation Notes

- Always use shadcn/ui components wherever possible
- The design system is configured in `tailwind.config.ts`
- Custom utility classes can be added as needed
- All measurements should follow these specifications

