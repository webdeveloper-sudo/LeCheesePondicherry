# Background Elements Directory

This directory contains decorative cheese-themed WebP images used by the `DecorativeWrapper` component.

## Required Images

Place the following WebP images in this directory:

### Main Elements (Required)
- **cheese_element_one.webp** - Primary cheese visual (top-left position)
  - Recommended size: 400x400px
  - Transparent background
  - Subtle, artisan cheese wheel or wedge

- **cheese_element_two.webp** - Secondary cheese visual (bottom-right position)
  - Recommended size: 400x400px
  - Transparent background
  - Complementary cheese variety

### Optional Decorative Elements
- **cheese_crumbs.webp** - Scattered cheese crumb particles
  - Size: 200-300px
  - Golden-yellow tones
  - Realistic texture
  - File size: <50KB

- **milk_splash.webp** - Delicate milk droplets
  - Size: 200-300px
  - Creamy white color
  - Scattered arrangement
  - File size: <50KB

- **cheese_swirl.webp** - Stretchy mozzarella string
  - Size: 150x300px (vertical)
  - Thin and translucent
  - Very subtle opacity
  - File size: <50KB

## Image Guidelines

- **Format**: WebP for optimal compression and quality
- **Background**: Transparent (PNG alpha channel)
- **Optimization**: Use tools like Squoosh or ImageOptim
- **Color Palette**: Match brand colors (#FAB519, #D4AF37, #F5E8C7)
- **Style**: Professional food photography aesthetic

## Usage

The `DecorativeWrapper` component automatically loads these images and positions them responsively across different screen sizes. Images are displayed with low opacity (5-20%) to avoid interfering with content readability.

## Fallback

If images are not present, the component will gracefully degrade without showing broken image icons, as they're applied via CSS background-image.
