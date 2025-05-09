import {
  Button,
  Card,
  Box,
  Grid,
  Typography,
  useTheme,
  // styled,
  Avatar,
  Divider,
  // alpha,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
} from '@mui/material';
import type { ApexOptions } from 'apexcharts';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Image from 'next/image';
import Chart from '@components/visualization/Chart/Chart';
import { Text } from '@components/common';

export const AccountBalance = () => {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
        },
      },
    },
    colors: ['#ff9900', '#1c81c2', '#333', '#5c6ac0'],
    dataLabels: {
      enabled: true,
      formatter: function (val: string | number) {
        return `${val}%`;
      },
      style: {
        colors: ['#FFF'],
      },
      background: {
        enabled: true,
        foreColor: '#FFF',
        padding: 8,
        borderRadius: 4,
        borderWidth: 0,
        opacity: 0.3,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.5,
        },
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: '#000',
        opacity: 0.5,
      },
    },
    fill: {
      opacity: 1,
    },
    labels: ['Bitcoin', 'Ripple', 'Cardano', 'Ethereum'],
    legend: {
      labels: {
        colors: '#FFF',
      },
      show: false,
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
  };

  const chartSeries = [10, 20, 25, 45];

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Typography
              sx={{
                pb: 3,
              }}
              variant="h4"
            >
              Account Balance
            </Typography>
            <Box>
              <Typography variant="h1" gutterBottom>
                $54,584.23
              </Typography>
              <Typography
                variant="h4"
                fontWeight="normal"
                color="text.secondary"
              >
                1.0045983485234 BTC
              </Typography>
              <Box
                display="flex"
                sx={{
                  py: 4,
                }}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    mr: 2,
                  }}
                  variant="rounded"
                >
                  <TrendingUp fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4">+ $3,594.00</Typography>
                  <Typography variant="subtitle2" noWrap>
                    this month
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Grid container spacing={3}>
              <Grid sm item>
                <Button fullWidth variant="outlined">
                  Send
                </Button>
              </Grid>
              <Grid sm item>
                <Button fullWidth variant="outlined">
                  Receive
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid
          sx={{
            position: 'relative',
          }}
          display="flex"
          alignItems="center"
          item
          xs={12}
          md={6}
        >
          <Box
            component="span"
            sx={{
              display: { xs: 'none', md: 'inline-block' },
            }}
          >
            <Divider absolute orientation="vertical" />
          </Box>
          <Box py={4} pr={4} flex={1}>
            <Grid container spacing={0}>
              <Grid
                xs={12}
                sm={5}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Chart
                  height={250}
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                />
              </Grid>
              <Grid xs={12} sm={7} item display="flex" alignItems="center">
                <List
                  disablePadding
                  sx={{
                    width: '100%',
                  }}
                >
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Image
                        width={20}
                        height={20}
                        src="/static/images/placeholders/logo/bitcoin.png"
                        alt="BTC"
                      ></Image>
                    </ListItemAvatar>
                    <ListItemText
                      primary="BTC"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Bitcoin"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true,
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        20%
                      </Typography>
                      <Text color="success">+2.54%</Text>
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Image
                        width={20}
                        height={20}
                        alt="XRP"
                        src="/static/images/placeholders/logo/ripple.png"
                      ></Image>
                    </ListItemAvatar>
                    <ListItemText
                      primary="XRP"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Ripple"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true,
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        10%
                      </Typography>
                      <Text color="error">-1.22%</Text>
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Image
                        width={20}
                        height={20}
                        alt="ADA"
                        src="/static/images/placeholders/logo/cardano.png"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="ADA"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Cardano"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true,
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        40%
                      </Typography>
                      <Text color="success">+10.50%</Text>
                    </Box>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Image
                        width={20}
                        height={20}
                        alt="ETH"
                        src="/static/images/placeholders/logo/ethereum.png"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="ETH"
                      primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                      secondary="Ethereum"
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        noWrap: true,
                      }}
                    />
                    <Box>
                      <Typography align="right" variant="h4" noWrap>
                        30%
                      </Typography>
                      <Text color="error">-12.38%</Text>
                    </Box>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};
