# Managing Changelog

The changelog system for linkin.one reads from the `CHANGELOG.md` file, making it easy to track and display version history.

## File Location

The changelog is stored at: `CHANGELOG.md` in the root directory.

## Format

Follow this standard format for changelog entries:

```markdown
# Changelog

All notable changes to linkin.one will be documented in this file.

## [Version Number] - YYYY-MM-DD

### Added
- New feature or capability
- Another new feature

### Changed
- Modification to existing functionality
- Another change

### Deprecated
- Feature that will be removed in future versions

### Removed
- Feature that has been removed

### Fixed
- Bug fix
- Another bug fix

### Security
- Security update or patch

### Improved
- Performance improvement
- UX enhancement
```

## Supported Categories

The changelog renderer supports these categories with emoji and color coding:

- **✨ Added** (Green) - New features
- **🔄 Changed** (Blue) - Changes in existing functionality  
- **⚠️ Deprecated** (Yellow) - Soon-to-be removed features
- **🗑️ Removed** (Red) - Removed features
- **🐛 Fixed** (Orange) - Bug fixes
- **🔒 Security** (Purple) - Security updates
- **⚡ Improved** (Blue) - Performance or UX improvements

## Example Entry

```markdown
## [1.1.0] - 2025-11-30

### Added
- Feedback system with floating widget
- Dedicated feedback page at `/feedback`
- Privacy Policy and Terms of Service pages

### Improved
- Better navigation across the application
- Responsive design for all pages

### Fixed
- Minor styling issues on mobile devices
```

## How It Works

1. The changelog page (`app/changelog/page.tsx`) reads the `CHANGELOG.md` file
2. The `ChangelogRenderer` component parses the markdown format
3. Each version is displayed in a card with:
   - Version number
   - Release date
   - Categorized changes with emoji and color coding

## Tips

- **Keep it chronological**: Latest versions at the top
- **Use semantic versioning**: MAJOR.MINOR.PATCH (e.g., 1.2.0)
- **Be descriptive**: Clear, concise descriptions of changes
- **Group similar changes**: Use appropriate categories
- **Date format**: Use YYYY-MM-DD or full date (e.g., "November 30, 2025")

## Updating Process

1. Open `CHANGELOG.md`
2. Add a new version section at the top (below the title)
3. Use the format shown above
4. Save the file
5. Changes will automatically appear on `/changelog` page

No rebuild or deployment required - changes are reflected immediately!
