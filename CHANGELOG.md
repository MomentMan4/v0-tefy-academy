# Changelog

## v0.1.36 (2025-05-12)

### Added
- Integrated Vercel Analytics for tracking user interactions and performance metrics
- Added tooltip in the top-right corner of the assessment results card for better visibility

### Changed
- Repositioned the methodology tooltip to the top-right corner of the assessment results card
- Ensured the recommended roles section displays only the top three roles based on match percentage
- Updated the SendEmailButton to use only the top three roles

## v0.1.35 (2025-05-10)

### Added
- Added methodology tooltip to explain role matching algorithm
- Implemented dynamic role recommendation system with weighted skill matching
- Added skill weights to each role definition for more accurate matching

### Changed
- Refactored role recommendation system to ensure accurate weight assignments
- Enhanced role matching algorithm to dynamically recommend roles based on individual skill profiles
- Improved transparency by adding methodology explanation

### Removed
- Removed PDF download functionality as requested

## v0.1.34 (2025-05-08)

### Added
- Added robust schema versioning system to track and apply database migrations
- Created new API routes for schema management: `/api/init/update-schema` and `/api/init/ensure-columns`
- Added new npm scripts: `update-schema` and `ensure-columns` for database maintenance

### Fixed
- Completely redesigned Supabase logging to eliminate dependency on `execute_sql` function
- Implemented multi-stage fallback approach for database operations
- Added comprehensive error handling for all database operations
- Improved user feedback when database operations fail
- Made database schema more adaptable to new functionalities

## v0.1.33 (2025-05-07)

### Fixed
- Fixed Supabase logging failure by implementing column existence checking before insertion
- Implemented a robust approach to handle missing columns in the database schema
- Added comprehensive fallback mechanism for PDF generation with default values
- Enhanced PDF content validation to ensure all sections are properly populated
- Added detailed error handling and logging for better debugging
- Replaced external image references with inline SVG to prevent loading errors
