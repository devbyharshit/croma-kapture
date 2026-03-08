# Croma Kapture - Excel Data Processor

## Overview

A modern web application built with React, TypeScript, and Shadcn UI that processes Excel files to filter and segregate RSM (Regional Sales Manager) data. The application provides an intuitive interface for uploading Excel files, processing data based on specific criteria, and downloading segregated results.

## Features

- **File Upload**: Drag-and-drop or click to upload Excel files (.xlsx, .xlsb, .xls)
- **Data Processing**: Filters RSM data by "Daljinder Saini" and applies business logic
- **Data Segregation**: Automatically categorizes entries into:
  - **Non-FS Entries**: FS Flag = "Non FS" & Case Ageing ≥ 7
  - **FS Croma Entries**: FS entries with "Croma" in Order Product & Case Ageing ≥ 10
  - **FS Other Entries**: FS entries without "Croma" in Order Product & Case Ageing ≥ 10
- **Results Download**: Download processed data in multiple Excel files
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Dark Mode**: Full dark mode support with theme variables
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

### Core
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.3.1** - Build tool and dev server

### UI & Styling
- **Shadcn UI** - Component library
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Class name utilities

### Data Processing
- **SheetJS (xlsx)** - Excel file reading and writing

## Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd croma-kapture
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the next available port)

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
croma-kapture/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── alert.tsx
│   │   ├── FileUpload.tsx   # File upload component
│   │   ├── ResultsDisplay.tsx # Results display component
│   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   └── ErrorMessage.tsx  # Error display component
│   ├── lib/
│   │   └── cn.ts            # Utility for class name merging
│   ├── utils/
│   │   └── excelProcessor.ts # Excel processing logic
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── components.json          # Shadcn UI configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Project dependencies
```

## Usage

### Uploading a File

1. Open the application in your browser
2. Either:
   - **Drag and drop** an Excel file onto the upload area
   - **Click** the upload area to browse and select a file
3. Supported formats: `.xlsx`, `.xlsb`, `.xls`

### Processing Data

The application automatically processes the uploaded file and:
1. Reads the "Kapture Open Case" sheet
2. Filters entries where RSM = "Daljinder Saini"
3. Excludes entries where Case Sub Status = "ACC"
4. Segregates remaining entries based on:
   - FS Flag value
   - Case Ageing threshold
   - Order Product content

### Downloading Results

After processing, click the "Download All Results" button to receive:
1. **non_fs_results.xlsx** - Non-FS entries
2. **fs_croma_results.xlsx** - FS Croma entries
3. **fs_other_results.xlsx** - FS Other entries
4. **all_segregated_results.xlsx** - Combined file with all categories in separate sheets plus a summary

## Configuration

### Customizing Filter Criteria

Edit `src/utils/excelProcessor.ts` to modify:

```typescript
const TARGET_SHEET = "Kapture Open Case";  // Sheet name
const RSM_NAME = "Daljinder Saini";        // RSM to filter
const RSM_COLUMN = "RSM";                  // Column name for RSM
const CASE_SUB_STATUS_COLUMN = "Case Sub Status"; // Exclusion column
const FS_FLAG_COLUMN = "FS Flag";          // FS Flag column
const CASE_AGEING_COLUMN = "Case Ageing";  // Ageing column
const ORDER_PRODUCT_COLUMN = "Order Product"; // Product column
```

### Customizing Theme

Edit `src/index.css` to modify color variables:

```css
:root {
  --primary: 0 0% 9%;           /* Primary color */
  --secondary: 0 0% 96.1%;      /* Secondary color */
  --destructive: 0 84.2% 60.2%; /* Error/destructive color */
  --radius: 0.5rem;             /* Border radius */
  /* ... more variables */
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Adding New Shadcn UI Components

To add more Shadcn UI components:

1. Manually create component files in `src/components/ui/`
2. Follow the Shadcn UI documentation: https://ui.shadcn.com/
3. Use the `cn()` utility from `@/lib/cn` for class merging

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured with React and TypeScript rules
- **Path Aliases**: Use `@/` prefix for imports (e.g., `@/components/ui/button`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus indicators on all interactive elements
- Semantic HTML structure

## Performance

- Optimized bundle size with Vite
- Tree-shaking for unused code elimination
- Lazy loading of components where applicable
- Efficient CSS with Tailwind's purge feature

## Security Considerations

- File processing happens client-side (no server upload)
- No data is sent to external servers
- All processing is done in the browser
- Excel files are read using the trusted SheetJS library

## Troubleshooting

### Build Errors

**Issue**: TypeScript errors about path aliases
```bash
Error: Cannot find module '@/components/ui/button'
```

**Solution**: Ensure `tsconfig.app.json` and `vite.config.ts` have correct path alias configuration.

### Styling Issues

**Issue**: Tailwind classes not applying

**Solution**: 
1. Check that `tailwind.config.js` includes correct content paths
2. Verify `@tailwind` directives are in `src/index.css`
3. Restart dev server

### File Upload Issues

**Issue**: File not processing

**Solution**:
1. Verify file format is `.xlsx`, `.xlsb`, or `.xls`
2. Check browser console for errors
3. Ensure file contains "Kapture Open Case" sheet
4. Verify required columns exist in the sheet

## Migration from Custom CSS

This project was recently migrated from custom CSS to Shadcn UI. See `SHADCN_MIGRATION.md` for detailed migration notes and benefits.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue in the repository.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [SheetJS](https://sheetjs.com/) for Excel file processing
- [Lucide](https://lucide.dev/) for the icon library
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
