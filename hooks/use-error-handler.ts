"use client"

import { useToast } from "@/components/ui/use-toast"
import { ApiError } from "@/lib/api"
import { useCallback } from "react"

export function useErrorHandler() {
  const { toast } = useToast()

  const handleError = useCallback((error: unknown, fallbackMessage?: string) => {
    console.error("Error caught by handler:", error)

    if (error instanceof ApiError) {
      if (error.status === 429) {
        toast({
          variant: "destructive",
          title: "LLM Limit Reached",
          description: "You've reached the AI usage limit for now. Please try again in a few minutes.",
        })
        return "LLM Limit Reached"
      }

      if (error.status === 401) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
        })
        return "Session Expired"
      }

      toast({
        variant: "destructive",
        title: "API Error",
        description: error.message || "An unexpected error occurred with the service.",
      })
      return error.message
    }

    if (error instanceof Error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || fallbackMessage || "Something went wrong.",
      })
      return error.message
    }

    toast({
      variant: "destructive",
      title: "Unknown Error",
      description: fallbackMessage || "An unexpected error occurred.",
    })
    return fallbackMessage || "Unknown error"
  }, [toast])

  return { handleError }
}
