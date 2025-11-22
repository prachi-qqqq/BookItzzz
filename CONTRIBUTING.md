# Contributing to BookItzzz

Thank you for your interest in contributing to BookItzzz! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/bookitzzz.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make your changes
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

Follow the setup instructions in [README.md](./README.md).

## Code Style

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Avoid `any` types; use proper typing
- Use type inference where appropriate

### Formatting

- Run `npm run format` before committing
- Prettier config in `.prettierrc`
- Use 2 spaces for indentation
- Single quotes for strings
- Trailing commas

### Linting

- Run `npm run lint` and fix all warnings
- ESLint config in `.eslintrc.json`
- No unused variables
- Prefer `const` over `let`

### Naming Conventions

- **Files**: camelCase for utilities, PascalCase for components
- **Functions**: camelCase
- **Components**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### Comments

- Use JSDoc comments for functions and complex logic
- Explain *why* not *what* in comments
- Keep comments up-to-date with code changes

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(books): add bulk CSV import
fix(auth): resolve Google OAuth redirect issue
docs(readme): update deployment instructions
```

## Pull Request Process

1. **Describe your changes**: Provide a clear description of what and why
2. **Link issues**: Reference related issues with `Fixes #123` or `Closes #456`
3. **Add tests**: Include unit or e2e tests for new features
4. **Update docs**: Update README or docs if needed
5. **Pass CI**: Ensure all checks pass (lint, typecheck, tests, build)
6. **Request review**: Tag relevant maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

## Testing Guidelines

### Unit Tests

- Write tests for business logic
- Use descriptive test names: `should calculate due date correctly`
- Cover edge cases
- Mock external dependencies
- Keep tests fast and isolated

### Integration Tests

- Test API endpoints end-to-end
- Use test database
- Clean up after tests

### E2E Tests

- Test critical user flows
- Keep stable and reliable
- Use data-testid attributes for selectors
- Avoid flaky tests

Run tests:
```bash
npm run test:unit
npm run e2e
```

## Database Changes

### Migrations

1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name description`
3. Review generated SQL
4. Test migration locally
5. Include migration files in PR

### Seed Data

- Keep seed script idempotent (use `upsert`)
- Use realistic data
- Document seed users and credentials

## API Changes

- Update OpenAPI spec in `docs/openapi.yaml`
- Add request/response validation with Zod
- Include examples in spec
- Document breaking changes

## Security

- Never commit secrets or API keys
- Use environment variables
- Validate all user input
- Sanitize SQL queries (Prisma handles this)
- Check for security vulnerabilities: `npm audit`
- Report security issues privately to maintainers

## Performance

- Use database indexes for frequent queries
- Implement pagination for large datasets
- Cache with Redis where appropriate
- Optimize images (use ImageKit transformations)
- Profile slow endpoints

## Accessibility

- Use semantic HTML
- Add `alt` text to images
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

## Questions?

- Open a GitHub issue for bugs
- Start a discussion for feature ideas
- Join our community chat (link)

Thank you for contributing! 🎉
