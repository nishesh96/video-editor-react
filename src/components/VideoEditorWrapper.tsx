import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import VideoPlayer from "./VideoPlayer";
import { DRAWER_WIDTH } from "../constants";
import VideoEditor from "./VideoEditor/VideoEditor";
import useEditVideoFile from "../backend/useEditVideoFile";
import { useAppContext } from "../hooks/useAppContext";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

const VideoEditorWrapper: React.FC = () => {
  const { isProcessing } = useAppContext();
  const { progress } = useEditVideoFile();
  const [videoFile, setVideoFile] = useState("");

  const label = useMemo(() => {
    if (isProcessing && progress) {
      return (
        <>
          <Typography variant="h5" gutterBottom>
            Video transcoding
          </Typography>
          <CircularProgressWithLabel size={56} value={progress} />
        </>
      );
    }

    if (isProcessing) {
      return (
        <>
          <Typography variant="h5" gutterBottom>
            Video transcoding
          </Typography>
          <CircularProgress size={56} />
        </>
      );
    }

    return "Click or Drop a Video File Here";
  }, [isProcessing, progress]);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (isProcessing) {
        return;
      }

      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0];

        if (!file.type.startsWith("video/")) {
          return;
        }

        const reader = new FileReader();

        reader.onload = async () => {
          let videoBlob = URL.createObjectURL(file);

          if (videoBlob) {
            setVideoFile(videoBlob);
          }
        };

        reader.readAsDataURL(file);
      }
    },
    [isProcessing]
  );

  const handleClick = useCallback(() => {
    if (isProcessing) {
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*";
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        let videoBlob = URL.createObjectURL(target.files[0]);

        if (videoBlob) {
          setVideoFile(videoBlob);
        }
      }
    };
    fileInput.click();
  }, [isProcessing]);

  return !videoFile ? (
    <Box
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        background: "white",
      }}
    >
      {label}
    </Box>
  ) : (
    <Container
      maxWidth="lg"
      sx={{
        p: "0 !important",
        height: "100dvh",
        display: "flex",
        background: "white",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)`, xs: "100%" },
        }}
      >
        <div style={{ position: "relative" }}>
          <VideoPlayer videoSrc={videoFile} />
        </div>
        <Divider />
        <VideoEditor />
      </Box>
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH, xs: 0 }, flexShrink: { md: 0 } }}
        aria-label="transcriptions drawer"
      ></Box>
    </Container>
  );
};

export default VideoEditorWrapper;
