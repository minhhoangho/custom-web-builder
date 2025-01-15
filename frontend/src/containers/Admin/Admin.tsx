import { Container, Typography } from '@mui/material';
import { PrivateLayout } from '@layouts/PrivateLayout';
import { BaseLayout } from '@layouts/BaseLayout';
import styles from './Admin.module.scss';

export function Admin() {
  return (
    <BaseLayout>
      <PrivateLayout>
        <Container className={styles['container']} maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Hi, Welcome back 👋
          </Typography>
        </Container>
      </PrivateLayout>
    </BaseLayout>
  );
}
