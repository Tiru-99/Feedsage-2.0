import { create } from "zustand";

interface Video  {
  title : string; 
  description : string
}

interface VideoMetaDataStoreType {
  video : Video | null ; 
  setVideo : (video : Video) => void ; 
  getVideo : () => Video | null  
}

export const useVideoMetadataStore = create<VideoMetaDataStoreType>(
  (set, get) => ({
    video: null,
    setVideo: (video) => set({ video }),
    getVideo: () => get().video,
  })
);