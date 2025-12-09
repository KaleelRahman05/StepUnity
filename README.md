# StepUnity

StepUnity is an Express + MongoDB web application that connects students and teachers. It supports user registration/login, teacher-student assignment, assignment submission/review, leave requests, workshops, and a small product/shop API.

This README documents how the project works, common commands, environment variables, API endpoints with examples, frontend integration notes, tests, and development tips.

**Table of contents**
- **Prerequisites**
- **Installation & commands**
- **Environment variables**
- **How the app starts (startup flow)**
- **Major components & where to find them**
- **API reference (common endpoints + examples)**
- **Frontend integration notes**
- **Testing**
- **Development tips & recommended improvements**

**Prerequisites**
- Node.js (v16+ recommended)
- npm
- MongoDB (local) or a MongoDB URI (Atlas can be used)

**Installation & commands**
- Install dependencies:

```powershell
npm install
```

- Run in development (restarts on change via `nodemon`):

```powershell
npm run dev
```

- Start normally:

```powershell
npm start
```

- Run tests (uses an in-memory MongoDB for CI/local tests):

```powershell
npm test
```

- Lint / format: none configured by default — add `eslint`/`prettier` if needed.

**Environment variables**
Create a `.env` file in the project root (or set env vars in your environment). Important variables:

- `MONGODB_URI` — MongoDB connection string. Default: `mongodb://127.0.0.1:27017/stepunity` if not set.
- `JWT_SECRET` — secret key used to sign JWTs. Use a long, random string in production.
- `PORT` — port the server listens on (default `5000`).

Example `.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/stepunity
JWT_SECRET=ReplaceThisWithAStrongRandomString
PORT=5000
```

**How the app starts (startup flow)**
1. `server.js` is the entry point used by `npm start` / `npm run dev`.
2. `dotenv` loads environment variables from `.env`.
3. `config/database.js` (`connectDB()`) connects mongoose to MongoDB.
4. Express middleware setup: `cors()`, `express.json()`, `express.urlencoded()`, and `express.static('public')`.
5. API routes are mounted under `/api/*`:
	 - `/api/auth` — authentication endpoints
	 - `/api/student` — student-only endpoints (protected)
	 - `/api/teacher` — teacher-only endpoints (protected)
	 - `/api/products` — product endpoints
	 - `/api/workshops` — workshop endpoints
6. A health check endpoint `GET /api/health` returns `{status:'OK'}`.

**Major components & where to find them**
- `server.js` — start script and route mounting.
- `app.js` — Express app configuration (used by tests and for composing middleware).
- `config/database.js` — Mongoose connection helper.
- `controllers/` — business logic and request handlers (`authController.js`, `studentController.js`, `teacherController.js`, `productController.js`, `workshopController.js`).
- `routes/` — express routers for each resource.
- `models/` — Mongoose schemas: `User`, `Assignment`, `LeaveRequest`, `Workshop`, `Product`.
- `middleware/`:
	- `authMiddleware.js` — `protect` (JWT verification + attach `req.user`) and `authorize(...roles)` for role-based access.
	- `errorHandler.js` — global error handler that maps Mongoose errors to friendly messages.
- `public/` — static frontend pages (HTML/CSS/JS). Main client logic for signup/login is in `public/js/auth.js`. A small helper `public/js/api.js` is included to centralize API requests.

**API reference (common endpoints + curl examples)**
Note: Replace `http://localhost:5000` with your server origin and include a valid JWT for protected endpoints.

- Register a user (student or teacher):

```bash
curl -X POST http://localhost:5000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","email":"alice@example.com","password":"secret","role":"student","rollNumber":"S123","department":"Dance","interestedStyle":"Folk"}'
```

- Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"secret"}'
```

Response contains `token` (JWT). For protected endpoints include header:

`Authorization: Bearer <token>`

- Get student dashboard (protected, `student` role):

```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/student/dashboard
```

- Teacher: create assignment (protected, `teacher` role):

```bash
curl -X POST http://localhost:5000/api/teacher/assignments \
	-H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
	-d '{"title":"Week 1","description":"Warm-up and basics","videoPrompt":"Upload your practice video","dueDate":"2025-12-20"}'
```

- Teacher: bulk assign students who match teacher specialization:

```bash
curl -X POST -H "Authorization: Bearer <token>" http://localhost:5000/api/teacher/assign-students
```

- Products (public):

```bash
curl http://localhost:5000/api/products
```

If authenticated and the user has `membershipStatus: true`, the response will include `finalPrice` (discount applied).

**Frontend integration notes**
- Static pages are in `public/` and are served by Express via `express.static('public')`. Typical pages include `signup.html`, `login.html`, `student-dashboard.html`, and `teacher-dashboard.html`.
- `public/js/auth.js` handles signup/login flows and stores JWT + user in `localStorage`:
	- `localStorage.setItem('token', data.token)`
	- `localStorage.setItem('user', JSON.stringify(data.user))`
- A helper `public/js/api.js` is provided to call API endpoints and automatically attach the `Authorization` header when available. Use `apiFetch('/student/dashboard', { method: 'GET' })` from client pages.

Security note: storing JWT in `localStorage` is simple but vulnerable to XSS. For production, consider storing tokens in HttpOnly cookies and protecting routes with CSRF mitigations.

**Testing**
- Unit/integration tests use Mocha and `mongodb-memory-server` under `test/`.
- Run tests:

```powershell
npm test
```

If `NODE_ENV=testing` is set (the `test` npm script sets it), the codebase may use a different database configuration suitable for in-memory tests.

**Development tips & recommended improvements**
- Centralize password hashing: move hashing to a Mongoose `pre('save')` hook on the `User` model to guarantee hashing everywhere a password is set.
- Input validation: add `express-validator` or `joi` to validate incoming request bodies (prevent invalid enums, missing fields).
- Rate limiting & brute-force protection: protect `POST /api/auth/login` and `POST /api/auth/register` using `express-rate-limit`.
- Secure cookies: in production, use secure, HttpOnly cookies for tokens and enable HTTPS.
- CORS hardening: in production, configure `cors()` to allow only trusted origins.
- Add logging: integrate a logger (winston/pino) and structured logs for production.

**Troubleshooting**
- If MongoDB connection fails, ensure MongoDB is running locally or `MONGODB_URI` is set to a reachable instance. Example to run locally:

```powershell
# If using the MongoDB server installed locally
mongod --dbpath "C:\data\db"
```

- If `npm test` fails, run the tests locally with verbose output:

```powershell
npx mocha "test/**/*.test.js" --timeout 10000 --exit
```

**Where to start exploring the code**
- Authentication flow: `controllers/authController.js` + `routes/authRoutes.js` + `middleware/authMiddleware.js`.
- Teacher/student domain: `controllers/teacherController.js`, `controllers/studentController.js`, and `models/Assignment.js`.
- Assignment submission flow: look at `studentController.submitAssignment` and `teacherController.reviewSubmission`.

If you'd like, I can:
- Add an OpenAPI (Swagger) file describing the API endpoints.
- Convert `public/js/auth.js` to use `public/js/api.js` helper and update the pages.
- Move password hashing into `models/User.js` pre-save and update tests accordingly.

---


