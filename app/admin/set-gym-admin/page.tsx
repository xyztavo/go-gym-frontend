"use client";

import { withProtectedRoute } from "@/components/auth/admin-protected-route";

function Page() {
  return <div>Authenticated!</div>;
}

export default withProtectedRoute(Page)