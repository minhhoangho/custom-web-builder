import { Container, Grid } from '@mui/material';
import { useQuery } from 'react-query';
import { toast } from '@components/common';
import { getDetailViewPoint } from '@api/view-point';
import { useChart } from '@components/visualization/Chart/use-chart';
import Chart from '@components/visualization/Chart/Chart';
import { BaseLayout, PrivateLayout } from 'src/layouts';

type ViewPointChartContainerProps = {
  viewPointId: number;
};

export function ViewPointChartContainer(props: ViewPointChartContainerProps) {
  const { viewPointId } = props;
  const { data: dataDetail } = useQuery({
    queryKey: ['getViewPointDetail', viewPointId],
    queryFn: () => {
      return getDetailViewPoint(viewPointId);
    },
    onError: () => toast('error', 'Error'),
    enabled: !!viewPointId,
    cacheTime: 1000,
  });

  const vehicleData = [0, 1, 3, 12, 45, 35, 12, 12, 59, 36, 39, 20];
  const timeBox = Array.from(
    { length: 12 },
    (_, i) => `${(i * 2).toString().padStart(2, '0')}:00`,
  );
  const charts = {
    labels: timeBox,
    series: [
      {
        name: 'Số phương tiện',
        type: 'line',
        fill: 'solid',
        data: vehicleData,
      },
    ],
  };

  const { labels, series } = charts;

  const chartOptions = useChart({
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i: any) => i.fill),
    },
    labels,
    xaxis: {
      type: 'string',
      title: {
        text: 'Thời gian trong ngày',
        style: {
          fontWeight: 'bold',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Số lượng phương tiện',
        style: {
          fontWeight: 'bold',
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  });

  return (
    <BaseLayout>
      <PrivateLayout>
        <Container>
          <Grid container columnSpacing={3}>
            <Grid item xs={12}>
              <p>{dataDetail?.name}</p>
            </Grid>
            <Grid item xs={12}>
              <Chart
                type="line"
                series={series}
                options={chartOptions}
                width="100%"
                height={364}
              />
            </Grid>
          </Grid>
        </Container>
      </PrivateLayout>
    </BaseLayout>
  );
}
