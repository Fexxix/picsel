"use client"

import { LoaderCircle } from "lucide-react"
import { completeOnboarding } from "./actions"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    ;(async () => {
      const res = await completeOnboarding()

      if (res.error) {
        setError(res.error)
      }

      await user?.reload()
      setIsLoading(false)

      router.replace("/")
    })()
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col gap-3 items-center">
          <LoaderCircle className="size-10 animate-spin" />
          <p>Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Onboarding complete! Redirecting...</p>
      )}
    </div>
  )
}
