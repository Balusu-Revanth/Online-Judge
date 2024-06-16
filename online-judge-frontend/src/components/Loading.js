import { Container, Box, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default Loading;
