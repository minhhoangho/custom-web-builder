import { Iconify } from '@components/common';

type BannerType = {
  type: 'error' | 'info' | 'warning' | 'success';
  description: JSX.Element;
};

const colorMap = {
  error: '#f5222d',
  warning: '#faad14',
  info: '#1890ff',
  success: '#52c41a',
};

const backgroundColorMap = {
  error: '#f87aad',
  warning: '#fceed2',
  info: '#83d2f8',
  success: '#c3f394',
};
const iconifyMap = {
  error: 'mdi-alert-circle',
  warning: 'mdi-warning',
  info: 'mdi-information',
  success: 'mdi-check-circle',
};
export function Banner({ type, description }: BannerType) {
  return (
    <div
      className="flex justify-center"
      style={{
        backgroundColor: backgroundColorMap[type],
      }}
    >
      <div className="icon mr-2">
        <Iconify icon={iconifyMap[type]} color={colorMap[type]} />
      </div>
      <div className="text">
        <p>{description}</p>
      </div>
    </div>
  );
}
