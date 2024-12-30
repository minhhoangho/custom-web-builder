import { IconCheckboxTick, IconRowsStroked } from '@douyinfe/semi-icons';
import { Dropdown } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { useLayout } from 'src/containers/Editor/hooks';
import { Iconify } from '@components/common';

export default function LayoutDropdown() {
  const { layout, setLayout } = useLayout();
  const { t } = useTranslation();

  const invertLayout = (component) =>
    setLayout((prev) => ({ ...prev, [component]: !prev[component] }));

  return (
    <Dropdown
      position="bottomLeft"
      style={{
        width: '180px',
        direction: 'ltr',
      }}
      render={
        <Dropdown.Menu>
          <Dropdown.Item
            icon={
              layout.header ? <IconCheckboxTick /> : <div className="px-2" />
            }
            onClick={() => invertLayout('header')}
          >
            {t('header')}
          </Dropdown.Item>
          <Dropdown.Item
            icon={
              layout.sidebar ? <IconCheckboxTick /> : <div className="px-2" />
            }
            onClick={() => invertLayout('sidebar')}
          >
            {t('sidebar')}
          </Dropdown.Item>
          <Dropdown.Item
            icon={
              layout.issues ? <IconCheckboxTick /> : <div className="px-2" />
            }
            onClick={() => invertLayout('issues')}
          >
            {t('issues')}
          </Dropdown.Item>
          <Dropdown.Divider />
        </Dropdown.Menu>
      }
      trigger="click"
    >
      <div className="py-1 px-2 hover-2 rounded flex items-center justify-center">
        <IconRowsStroked size="extra-large" />
        <div>
          <Iconify icon="mdi:caret-down" />
        </div>
      </div>
    </Dropdown>
  );
}
