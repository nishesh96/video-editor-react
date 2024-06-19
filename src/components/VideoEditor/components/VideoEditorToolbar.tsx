import { Box } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";

const VideoEditorToolbar: React.FC = () => {
  return (
    <Grid container spacing={0} py={1} gap={1}>
      <Grid xs sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box
          sx={{
            display: { xs: "block", md: "none", lineHeight: 1 },
          }}
        ></Box>
      </Grid>
    </Grid>
  );
};

export default VideoEditorToolbar;
