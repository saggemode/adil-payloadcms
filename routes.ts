/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = [
  '/',
  '/:productId',

  '/products/:productId',
  '/auth/new-verification',
]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */

export const protectedRoutes = [
  '/shipping-address',
  '/payment-method',
  '/place-order',
  '/profile',
  '/order',
  '/dashboard',
  '/admin',
]


export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";



// this is for the school route

export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[]
}

export const routeAccessMap: RouteAccessMap = {
  //'/admin(.*)': ['admin'],
  '/student(.*)': ['student'],
  '/teacher(.*)': ['teacher'],
  '/parent(.*)': ['parent'],
  '/list/teachers': ['admin', 'teacher'],
  '/list/students': ['admin', 'teacher'],
  '/list/parents': ['admin', 'teacher'],
  '/list/subjects': ['admin'],
  '/list/classes': ['admin', 'teacher'],
  '/list/exams': ['admin', 'teacher', 'student', 'parent'],
  '/list/assignments': ['admin', 'teacher', 'student', 'parent'],
  '/list/results': ['admin', 'teacher', 'student', 'parent'],
  '/list/attendance': ['admin', 'teacher', 'student', 'parent'],
  '/list/events': ['admin', 'teacher', 'student', 'parent'],
  '/list/announcements': ['admin', 'teacher', 'student', 'parent'],
}