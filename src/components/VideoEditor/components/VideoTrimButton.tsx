import { useCallback, useMemo } from "react";

import { Button, ButtonProps, Tooltip } from "@mui/material";
import { CropFree } from "@mui/icons-material";

import useEditVideoFile from "../../../backend/useEditVideoFile";
import { useAppContext } from "../../../hooks/useAppContext";
import useGetVideoInfo from "../../../hooks/useGetVideoInfo";

const VideoTrimButton: React.FC<ButtonProps> = ({ ...buttonProps }) => {
  const { timelineStartTime, timelineEndTime, isProcessing, videoRef } =
    useAppContext();
  const { duration } = useGetVideoInfo();
  const { cutVideo } = useEditVideoFile();

  const hasChanges = useMemo(
    () => timelineStartTime || timelineEndTime !== duration,
    [duration, timelineEndTime, timelineStartTime]
  );

  const handleApplychanges = useCallback(async () => {
    const resultBlobUrl = await cutVideo([
      [timelineStartTime, timelineEndTime],
    ]);

    if (!resultBlobUrl || !videoRef) {
      return;
    }
    videoRef.src = resultBlobUrl;
  }, [cutVideo, duration, timelineEndTime, timelineStartTime, videoRef]);

  return (
    <Tooltip
      arrow
      disableFocusListener
      placement="top"
      title="Trims parts of the video outside the selection"
    >
      <span>
        <Button
          sx={{ textTransform: "none" }}
          disabled={!hasChanges || isProcessing}
          startIcon={<CropFree color="inherit" />}
          size="small"
          variant="contained"
          onClick={handleApplychanges}
          {...buttonProps}
        >
          Trim
        </Button>
      </span>
    </Tooltip>
  );
};

export default VideoTrimButton;
