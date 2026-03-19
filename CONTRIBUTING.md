# Contributing to Roommates Platform

Thank you for your interest in contributing! 🎉

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

---

## 🤝 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards
- ✅ Be respectful and inclusive
- ✅ Accept constructive criticism
- ✅ Focus on what's best for the community
- ❌ No harassment or discriminatory language
- ❌ No trolling or insulting comments

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
```bash
git clone https://github.com/YOUR_USERNAME/roommates-platform.git
cd roommates-platform
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Setup environment variables**
```bash
# Copy example files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. **Initialize database**
```bash
cd backend
npx prisma generate
npx prisma db push
```

5. **Start development servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/` - New features (e.g., `feature/add-payment`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)
- `docs/` - Documentation (e.g., `docs/api-guide`)
- `test/` - Tests (e.g., `test/auth-flow`)

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```bash
git commit -m "feat(auth): add social login support"
git commit -m "fix(chat): resolve message duplication issue"
git commit -m "docs(readme): update installation steps"
```

---

## 📝 Coding Standards

### TypeScript
```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  fullName: string;
}

const getUser = async (id: string): Promise<User> => {
  // Implementation
};

// ❌ Bad
const getUser = async (id) => {
  // No types
};
```

### React Components
```typescript
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
};

// ❌ Bad - No types, unclear props
export const Button = ({ label, onClick, variant }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

### File Organization
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components
├── pages/            # Page components
├── hooks/            # Custom hooks
├── utils/            # Utility functions
├── types/            # TypeScript types
└── constants/        # Constants
```

### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types**: PascalCase (`UserType.ts`)

---

## 🎨 Style Guide

### CSS/Tailwind
```tsx
// ✅ Good - Organized classes
<div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Title</h1>
</div>

// ❌ Bad - Unorganized, inline styles
<div style={{display: 'flex'}} className="p-4 bg-white rounded-xl">
  <h1 style={{fontSize: '24px'}}>Title</h1>
</div>
```

### Error Handling
```typescript
// ✅ Good
try {
  const response = await api.getUser(id);
  return response.data;
} catch (error) {
  console.error('Failed to fetch user:', error);
  throw new Error('User fetch failed');
}

// ❌ Bad
try {
  const response = await api.getUser(id);
  return response.data;
} catch (error) {
  // Silent failure
}
```

---

## 🔍 Testing

### Running Tests
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# E2E tests
npm run test:e2e
```

### Writing Tests
```typescript
// Example test
describe('User Authentication', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

---

## 📤 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console errors
- [ ] Documentation updated
- [ ] Commits are clean and descriptive

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
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
```

### Review Process
1. Submit PR with clear description
2. Wait for automated checks
3. Address review comments
4. Get approval from maintainer
5. Merge!

---

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other information
```

---

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution**
How you'd like it to work

**Describe alternatives**
Other solutions you've considered

**Additional context**
Mockups, examples, etc.
```

---

## 📚 Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [VS Code](https://code.visualstudio.com)
- [Postman](https://www.postman.com)
- [Prisma Studio](https://www.prisma.io/studio)

---

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! 🎉

---

## 📞 Questions?

- Open an issue
- Join our Discord
- Email: contribute@roommates-platform.com

---

**Happy Coding! 💻**
