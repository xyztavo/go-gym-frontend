
# Go-Gym Frontend

## Overview
Go-Gym is a gym management app where gym admins can create gyms, manage plans, exercises, and routines, while users can check in using QR codes and track their workouts.

## Features
- **Admin Features**:
  - Create gyms, exercises, routines, and plans
  - Manage users and gym routines
  - Scan QR codes to check in users
- **User Features**:
  - Register, log in, and track progress
  - Generate and scan QR codes for check-in

## Tech Stack
- **Next.js** (React framework)
- **Tailwind CSS / Shadcn UI** (styling)
- **React Query** (data fetching)
- **Zod** (validation)

## Screen shots:
<img src="https://raw.githubusercontent.com/xyztavo/go-gym-frontend/refs/heads/main/public/screenshots/desktop.png" alt="desktop" width="600"/>
<img src="https://raw.githubusercontent.com/xyztavo/go-gym-frontend/refs/heads/main/public/screenshots/mobile.png" alt="mobile" width="300"/>

## Usage
- change [env](https://github.com/xyztavo/go-gym-frontend/blob/main/.env) to .env.local
- change the base url route to yours 
```sh
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/"
```
- you gotta have a backend running for the app to work,
instructions in [go-gym](https://github.com/xyztavo/go-gym) github repo
- run a dev server and test it out
```sh
bun dev
```
## Todo
- [ ] ui looks like absolute shit and inconsistent [50% done]
some hydration errors will prob never be fixed, its already supressed in prod. its related to external modules.

