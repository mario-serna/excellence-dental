# Development Environment Setup & Troubleshooting

## Key Lessons Learned

### Environment Configuration
- **Set up all tooling upfront** - Prevents workflow interruptions
- **Use consistent configurations** - Ensures team collaboration works smoothly
- **Document setup processes** - Enables quick onboarding and recovery

### Common Issues & Solutions

#### Dependency Management
- **Problem**: Missing dev dependencies for tooling
- **Solution**: Install all required packages upfront
- **Prevention**: Check package.json completeness, use lock files

#### Configuration File Conflicts
- **Problem**: Multiple configuration files overriding each other
- **Solution**: Understand configuration precedence, document settings
- **Prevention**: Create configuration documentation, use consistent naming

#### Line Ending Issues
- **Problem**: LF/CRLF conversion warnings in git
- **Solution**: Configure .gitattributes, use consistent settings
- **Prevention**: Set up proper git configuration early

### Environment Setup Checklist

#### Initial Setup
- [ ] Install package manager (bun/npm/yarn)
- [ ] Initialize project with proper package.json
- [ ] Configure git repository
- [ ] Set up .gitignore
- [ ] Install development dependencies

#### Code Quality Tools
- [ ] Configure Prettier
- [ ] Configure ESLint
- [ ] Set up VSCode settings
- [ ] Add format and lint scripts
- [ ] Test formatting on sample files

#### Testing Setup
- [ ] Install testing framework (Vitest)
- [ ] Configure test environment
- [ ] Add test scripts
- [ ] Create basic verification test
- [ ] Set up coverage reporting

#### Git Configuration
```bash
# Set up user identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure line endings
git config --global core.autocrlf false
git config --global core.eol lf

# Set up default branch
git config --global init.defaultBranch main
```

#### .gitignore Template
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
*.lcov

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp
```

### Package.json Scripts Template

#### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next out dist node_modules",
    "reset": "bun run clean && bun install"
  }
}
```

### Recovery Commands

#### Dependency Issues
```bash
# Clear package manager cache
bun pm cache clean

# Reinstall all dependencies
rm -rf node_modules bun.lock
bun install

# Update dependencies
bun update

# Check for outdated packages
bun outdated
```

#### Git Issues
```bash
# Reset to clean state
git reset --hard HEAD
git clean -fd

# Fix corrupted repository
git fsck --full

# Recover lost commits
git reflog
git checkout -b recovery <commit-hash>
```

#### Configuration Issues
```bash
# Reset VSCode settings
code --reset-settings

# Clear npm cache
npm cache clean --force

# Reconfigure git
git config --global --unset-all user.name
git config --global --unset-all user.email
```

### Environment Variables Template

#### .env.example
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
API_KEY="your-api-key"
WEBHOOK_SECRET="your-webhook-secret"

# Development
NODE_ENV="development"
PORT="3000"
```

### Docker Setup (Optional)

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: dbname
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Memory Triggers
- When setting up new projects
- When environment tools fail
- During onboarding process
- When collaborating with team members
- Before deployment
