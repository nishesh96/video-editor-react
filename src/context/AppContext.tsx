import React, { useCallback, useEffect, useMemo, useState } from "react";

export type TAppContext = {
  timelineStartTime: number;
  setTimelineStartTime: (value: number) => void;
  currentSeekTime: number;
  setCurrentSeekTime: (value: number) => void;
  timelineEndTime: number;
  setTimelineEndTime: (value: number) => void;
  videoRef: HTMLVideoElement | null;
  setVideoRef: (instance: HTMLVideoElement | null) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  resetEditState: () => void;
};

export const AppContext = React.createContext<TAppContext | null>(null);

export default function AppContextProvider({
  children,
}: React.PropsWithChildren) {
  const [timelineStartTime, setTimelineStartTime] = useState(0);
  const [currentSeekTime, setCurrentSeekTime] = useState(0);
  const [timelineEndTime, setTimelineEndTime] = useState(0);
  const [videoRef, _setVideoRef] = useState<TAppContext["videoRef"]>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const resetEditState = useCallback(() => {
    setCurrentSeekTime(0);
    setTimelineStartTime(0);
    videoRef?.duration && setTimelineEndTime(videoRef?.duration);
  }, [videoRef]);

  const observer = useMemo(
    () =>
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "src"
          ) {
            resetEditState();
          }
        }
      }),
    [resetEditState]
  );

  useEffect(() => {
    if (videoRef) {
      videoRef.addEventListener("loadedmetadata", () => {
        const duration = ~~Math.floor(videoRef?.duration);
        setTimelineEndTime(duration);
      });

      observer.observe(videoRef, { attributes: true });
    }

    return () => observer.disconnect();
  }, [observer, videoRef]);

  const setVideoRef = useCallback<TAppContext["setVideoRef"]>((ref) => {
    if (ref) {
      _setVideoRef(ref);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        timelineStartTime,
        setTimelineStartTime,
        timelineEndTime,
        setTimelineEndTime,
        videoRef,
        setVideoRef,
        isProcessing,
        setIsProcessing,
        currentSeekTime,
        setCurrentSeekTime,
        resetEditState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
