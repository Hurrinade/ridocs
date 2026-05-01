import { Navigate, Route, Routes } from "react-router";
import Root from "@/pages/Root";
import { AuthLoading } from "convex/react";

function App() {
  return (
    <div className="h-svh flex flex-col overflow-hidden">
      <main className="min-w-0 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <AuthLoading>
        <p className="sr-only">Loading authentication</p>
      </AuthLoading>
    </div>
  );
}

export default App;
