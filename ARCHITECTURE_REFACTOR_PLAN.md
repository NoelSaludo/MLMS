# Architecture Refactoring Plan: Migrating to a Clean BFF Pattern

This document outlines the refactoring plan to streamline the Next.js frontend architecture of the Mini Learning Management System. The primary objective is to transition from an over-abstracted architecture with redundant caching layers to a clean Backend-for-Frontend (BFF) pattern using a unified, lightweight API client and native Next.js caching.

---

## 1. Map of the Current Data Flow

Currently, the data fetching flow goes through multiple redundant wrappers and manual caching layers, leading to over-abstraction:

```
[ Client Components / Hooks ] (e.g., useCourseAnnouncements)
            │
            ▼ (HTTP GET /api/courses/[slug]/announcements)
[ Next.js API Routes / Handlers ] (e.g., app/api/courses/[slug]/announcements/route.ts)
            │
            ▼ (TypeScript Function Call)
[ Data Abstraction Layer (DAL) ] (e.g., lib/dal.ts using React 'cache')
            │
            ▼ (TypeScript Function Call)
[ Data Transfer Object Layer (DTO) ] (e.g., lib/dto.ts, optionally wraps DAL)
            │
            ▼ (TypeScript Function Call)
[ Custom Service Layer ] (e.g., services/course_services.ts using standard fetch)
            │
            ▼ (HTTP GET /course/{course_id}/contents)
[ FastAPI Backend API ] (e.g., backend/api/course.py)
            │
            ▼ (SQLAlchemy / DB Query)
     [ SQLite Database ]
```

### Trace Example: Fetching Course Announcements

To demonstrate the current state, here is a detailed trace of fetching announcements for a course:

1. **Client Hook (`useCourseAnnouncements.ts`)**:
   - The React hook `useCourseAnnouncements(courseId)` initiates a client-side fetch:
     `fetch('/api/courses/${courseId}/announcements')`

2. **Next.js API Route Handler (`app/api/courses/[slug]/announcements/route.ts`)**:
   - The route handler receives the request, awaits `params` to get the `courseId`, verifies the session using `verifySession()`, and then invokes `getCourseContentsById(courseId)` from `lib/dal.ts`.

3. **Data Abstraction Layer / Custom Cache (`lib/dal.ts`)**:
   - `getCourseContentsById` is wrapped in React's `cache(...)`. It intercepts the call and forwards it to the custom service function `getCourseAnnouncements(courseId)` defined in `services/course_services.ts`.

4. **Custom Service Layer (`services/course_services.ts`)**:
   - `getCourseAnnouncements(courseId)` reads `process.env.BACKEND_URL`, formats the request URL `${serverUrl}/course/${courseId}/contents`, sets custom JSON headers, calls the native `fetch` API, parses the response JSON, and returns the result back up the chain.

5. **FastAPI Backend (`backend/api/course.py`)**:
   - The FastAPI backend receives the GET request at `/course/{course_id}/contents`. The route dependency `get_db` gets a database session, calls `get_course_contents(db, course_id)` from `services/course_service.py`, and returns the contents as a JSON response.

---

## 2. Targeted Directories and Files

The following directories and files are targeted for complete deletion or consolidation. No actual source code changes will be made until approval is granted.

### Targeted for Deletion:
* **`frontend/lib/dal.ts`**: Currently defines verifySession and caches backend data requests using React's manual `cache` function.
* **`frontend/lib/dto.ts`**: Currently contains a redundant layer of functions wrapping `lib/dal.ts` (e.g., `getUserData`).

### Targeted for Deletion / Consolidation into the new Unified API Client:
* **`frontend/services/course_services.ts`**: Contains helper functions executing manual backend fetches for course content.
* **`frontend/services/file_services.ts`**: Contains manual backend fetch operations for files uploading and downloading.
* **`frontend/services/login_services.ts`**: Contains manual backend fetch operations for user retrieval.

> *Note: Session-related files (`frontend/lib/session.ts` and `frontend/lib/auth.ts`) will be retained as they implement standard encrypted session cookies and handle authentication redirects.*

---

## 3. Proposed Structure for Unified API Client (`lib/api-client.ts`)

A unified TypeScript-safe API client will replace the entire `frontend/services` directory. It uses standard HTTP methods, handles file uploads (`FormData`), and leverages native Next.js 15+ fetch options (`next: { revalidate, tags }`) to control caching natively.

```typescript
// frontend/lib/api-client.ts
import 'server-only';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { revalidate, tags, headers, ...rest } = options;
  const url = `${BACKEND_URL}${path}`;

  const fetchOptions: RequestInit = {
    ...rest,
    headers: {
      ...headers,
    },
  };

  // Automatically set Content-Type to JSON if body is not FormData
  if (!(rest.body instanceof FormData)) {
    fetchOptions.headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };
  }

  // Support native Next.js caching configurations
  if (revalidate !== undefined || tags !== undefined) {
    fetchOptions.next = {
      ...(revalidate !== undefined && { revalidate }),
      ...(tags !== undefined && { tags }),
    };
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`API Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: any, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),

  postMultipart: <T>(path: string, body: FormData, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body: any, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
```

---

## 4. Step-by-Step Safe Migration Execution Plan

To perform this refactoring safely without breaking the application, we will follow a phased, non-breaking execution strategy:

### Phase 1: Establish Unified Client
1. **Create the file `frontend/lib/api-client.ts`** with the proposed structure.
2. Confirm the file compilation and ensure it integrates nicely with the existing TypeScript configurations.

### Phase 2: Migrate Core Session & User Layer
1. Refactor `frontend/lib/session.ts` and `frontend/lib/auth.ts` to call `apiClient` directly for fetching user details from FastAPI (`/user/{email}`).
2. Re-route other system files currently calling `getUser` from `services/login_services.ts` to fetch via the new unified API client (or keep them temporarily backward compatible).

### Phase 3: Migrate Next.js API Handlers (BFF Endpoints)
One-by-one, transition the Next.js API Routes to call `apiClient` directly instead of referencing `dal.ts` or custom services:
- **`app/api/my-courses/route.ts`**: Replace `getUserCourses` with direct `apiClient.get('/user/{id}/courses')`.
- **`app/api/content/route.ts`**: Replace `getCourseContentDetails` with `apiClient.get('/course/content/?courseId=...&contentId=...')`.
- **`app/api/courses/[slug]/route.ts`**: Replace `getCourseById` with `apiClient.get('/course/{id}')`.
- **`app/api/courses/[slug]/announcements/route.ts`**: Replace `getCourseContentsById` with `apiClient.get('/course/{id}/contents')`.
- **`app/api/courses/[slug]/materials/route.ts`**: Replace `getCourseMaterialsById` with `apiClient.get('/course/{id}/materials')`.
- **`app/api/courses/[slug]/members/route.ts`**: Replace `getCourseMembersById` with `apiClient.get('/course/{id}/members')`.
- **`app/api/upload/[slug]/route.ts`**: Replace file upload service calls with `apiClient.postMultipart` calls.

### Phase 4: Clean Up & Code Deletion
Once all BFF endpoints are migrated and direct dependencies are removed:
1. Delete the redundant layers:
   - `frontend/lib/dal.ts`
   - `frontend/lib/dto.ts`
2. Delete the legacy services directory:
   - `frontend/services/course_services.ts`
   - `frontend/services/file_services.ts`
   - `frontend/services/login_services.ts`
3. Remove the entire `frontend/services/` directory once empty.

### Phase 5: Verification & Testing
1. Run backend unit tests (`pytest`) to verify the FastAPI backend endpoints are unimpacted.
2. Run frontend linter (`npm run lint`) to ensure no dead imports or type mismatch issues remain in the Next.js workspace.
3. Validate application flow end-to-end to ensure course creation, announcement submission, material uploads, and member listings continue to work flawlessly.
