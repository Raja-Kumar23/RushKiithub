import { Suspense } from "react"
import ViewerClient from "./viewer-client"

export default function ViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="loading-screen">
          <h2>🔄 Loading...</h2>
        </div>
      }
    >
      <ViewerClient />
    </Suspense>
  )
}