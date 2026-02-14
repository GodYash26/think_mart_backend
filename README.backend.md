# 🚀 ThinkMart Backend API

NestJS backend application for ThinkMart e-commerce platform.

## 🌐 Live API

**Production:** [https://think-mart-backend.onrender.com/api](https://think-mart-backend.onrender.com/api)

---

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **MongoDB** - NoSQL database
- **TypeORM** - ORM for database operations
- **JWT & Passport** - Authentication & authorization
- **ImageKit** - Image storage and CDN
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **Swagger** - API documentation

---

## 📦 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/thinkmart

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=3000

# Admin Seed
ADMIN_EMAIL=admin@thinkmart.com
ADMIN_PASSWORD=Admin@123456

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

**💡 Tip:** Use `.env.example` as a template

### 3. Seed Admin User
```bash
npm run seed:admin
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order (Admin only)

### Media
- `POST /api/media/upload` - Upload image (Admin only)

### User Management
- `GET /api/user` - List users (Admin only)
- `GET /api/user/:id` - Get user details
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user (Admin only)

---

---

## 🔐 Authentication & Authorization

### JWT Authentication
- Tokens stored in HTTP-only cookies
- Automatic token validation on protected routes
- Token refresh on expiry

### Role-Based Access Control
- **Admin Role:** Full access to all resources
- **Customer Role:** Access to own data only

### Guards
- `JwtAuthGuard` - Validates JWT token
- `RoleGuard` - Checks user role permissions

---

## 📁 Project Structure

```
src/
├── auth/              # Authentication module
├── cart/              # Shopping cart module
├── categories/        # Category management
├── config/            # Configuration files
├── decorators/        # Custom decorators
├── guards/            # Auth & role guards
├── media/             # Image upload module
├── orders/            # Order management
├── products/          # Product management
├── seeds/             # Database seeders
├── strategies/        # Passport strategies
├── user/              # User management
└── main.ts            # Application entry point
```

---

## 🔧 Configuration

### Database
MongoDB connection configured in `config/database.config.ts`

```typescript
type: 'mongodb',
url: process.env.MONGO_URI,
autoLoadEntities: true,
synchronize: true
```

### ImageKit
Image upload configured in `config/imagekit.config.ts`

### Security
- Helmet for security headers
- CORS enabled for frontend origin
- Rate limiting with throttler
- Cookie-based authentication

---

## 🐛 Common Issues

### MongoDB Connection
**Error:** Cannot connect to MongoDB
- Check `MONGO_URI` in `.env`
- Ensure MongoDB is running
- For Atlas, whitelist your IP

### ImageKit Upload
**Error:** ImageKit upload failed
- Verify credentials in `.env`
- Check ImageKit account status
- Ensure file size is within limits

### Port Already in Use
**Error:** Port 3000 is already in use
- Change `PORT` in `.env`
- Kill existing process: `npx kill-port 3000`

---

## 📝 Scripts

```bash
npm run dev           # Development with hot reload
npm run build         # Build for production
npm run start:prod    # Run production build
npm run seed:admin    # Create admin user
npm run lint          # Lint code
npm run format        # Format code with Prettier
```

---

## 🌍 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT | Yes | - |
| `PORT` | Server port | No | 3000 |
| `ADMIN_EMAIL` | Admin email for seeding | No | admin@example.com |
| `ADMIN_PASSWORD` | Admin password for seeding | No | Admin@1234 |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | Yes | - |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | Yes | - |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | Yes | - |

---


**Built with NestJS ❤️**
