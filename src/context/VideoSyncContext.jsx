/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const VideoSyncContext = createContext()

export function VideoSyncProvider({ children }) {
  const [heroVideoRef, setHeroVideoRef] = useState(null)

  return (
    <VideoSyncContext.Provider value={{ heroVideoRef, setHeroVideoRef }}>
      {children}
    </VideoSyncContext.Provider>
  )
}

export function useVideoSync() {
  return useContext(VideoSyncContext)
}
