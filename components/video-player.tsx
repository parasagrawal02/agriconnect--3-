"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCw } from "lucide-react"

interface VideoPlayerProps {
  productId: string
  prompt?: string
}

export function VideoPlayer({ productId, prompt }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoUrl, setVideoUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    // Set isMounted to true when component mounts
    isMounted.current = true

    // In a real app, this would be an API call to generate or fetch the video
    const generateVideo = async () => {
      try {
        if (!isMounted.current) return
        setLoading(true)

        // Simulate API delay for video generation
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // For demo purposes, we'll use a sample video
        // In a real app, this would be the URL returned from the AI video generation service
        if (isMounted.current) {
          setVideoUrl("/placeholder.svg?height=400&width=600")

          // Simulate video loaded event after a delay
          setTimeout(() => {
            if (isMounted.current) {
              setLoading(false)
              setDuration(120) // Mock 2 minute duration
            }
          }, 1000)
        }
      } catch (error) {
        console.error("Error generating video:", error)
        if (isMounted.current) {
          setLoading(false)
          setError("Failed to load video. Please try again later.")
        }
      }
    }

    generateVideo()

    // Cleanup
    return () => {
      isMounted.current = false
      if (videoRef.current) {
        // Pause the video before unmounting to prevent abort errors
        try {
          videoRef.current.pause()
        } catch (e) {
          console.error("Error pausing video:", e)
        }
      }
    }
  }, [productId, prompt])

  const togglePlay = async () => {
    if (!videoRef.current) return

    try {
      if (playing) {
        videoRef.current.pause()
        setPlaying(false)
      } else {
        // Wrap play in try/catch as it returns a promise that might reject
        try {
          await videoRef.current.play()
          setPlaying(true)
        } catch (err) {
          console.error("Error playing video:", err)
          // If the play was aborted due to user interaction, don't show an error
          if (err instanceof DOMException && err.name !== "AbortError") {
            setError("Failed to play video. Please try again.")
          }
          setPlaying(false)
        }
      }
    } catch (e) {
      console.error("Error in togglePlay:", e)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = !muted
        setMuted(!muted)
      } catch (e) {
        console.error("Error toggling mute:", e)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current && isMounted.current) {
      try {
        const currentTime = videoRef.current.currentTime
        const duration = videoRef.current.duration || 0
        const progressPercent = (currentTime / duration) * 100

        setCurrentTime(currentTime)
        setProgress(progressPercent)
      } catch (e) {
        console.error("Error updating time:", e)
      }
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      try {
        const rect = progressRef.current.getBoundingClientRect()
        const pos = (e.clientX - rect.left) / rect.width
        videoRef.current.currentTime = pos * videoRef.current.duration
      } catch (e) {
        console.error("Error in progress click:", e)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      try {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen()
        }
      } catch (e) {
        console.error("Error entering fullscreen:", e)
      }
    }
  }

  const handleReload = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0
        try {
          await videoRef.current.play()
          setPlaying(true)
        } catch (err) {
          console.error("Error playing video after reload:", err)
          if (err instanceof DOMException && err.name !== "AbortError") {
            setError("Failed to play video. Please try again.")
          }
          setPlaying(false)
        }
      } catch (e) {
        console.error("Error reloading video:", e)
      }
    }
  }

  // Handle video errors
  const handleVideoError = () => {
    setError("Error loading video. Please try again later.")
    setLoading(false)
  }

  return (
    <div className="relative rounded-lg overflow-hidden">
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="flex justify-center items-center">
            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
            <span className="ml-2">Generating AI video...</span>
          </div>
          {prompt && (
            <Card className="p-3 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Prompt:</span> {prompt}
              </p>
            </Card>
          )}
        </div>
      ) : error ? (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              setError(null)
              setLoading(true)
              // Retry loading the video
              setTimeout(() => {
                setLoading(false)
                setVideoUrl("/placeholder.svg?height=400&width=600")
              }, 1500)
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            poster="/placeholder.svg?height=400&width=600"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setPlaying(false)}
            onError={handleVideoError}
            muted={muted}
            playsInline // Add playsInline for better mobile support
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 text-white">
            <div
              ref={progressRef}
              className="h-1 bg-gray-500 rounded-full mb-2 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={togglePlay}
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <span className="text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={handleReload}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={handleFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
