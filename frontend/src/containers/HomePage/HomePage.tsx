import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { PathName } from '@constants/routes';
import { BaseLayout, PublicLayout } from 'src/layouts';
import styles from './HomePage.module.scss';
export function HomePage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(PathName.Admin);
  };
  return (
    <BaseLayout>
      <PublicLayout>
        <Container className={styles['container']} maxWidth="xl">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
          >
            <Typography variant="h4" sx={{ mb: 5 }}>
              Hi, Welcome back 👋
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRedirect}
            >
              Go to Admin
            </Button>
          </Box>
        </Container>
      </PublicLayout>
    </BaseLayout>
  );
}
