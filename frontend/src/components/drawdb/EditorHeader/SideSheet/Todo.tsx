import { MouseEvent, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  Grid,
  List,
  ListItem,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Iconify, Popover } from '@components/common';
import { useSaveState, useTasks } from 'src/containers/Editor/hooks';
import { State } from '@constants/editor';
import { Input } from '@components/form/Input';

const Priority = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

const SortOrder = {
  ORIGINAL: 'my_order',
  PRIORITY: 'priority',
  COMPLETED: 'completed',
  ALPHABETICALLY: 'alphabetically',
};

export default function Todo() {
  const [activeTask, setActiveTask] = useState(-1);
  const [, setSortOrder] = useState(SortOrder.ORIGINAL);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { tasks, setTasks, updateTask } = useTasks();
  const { setSaveState } = useSaveState();
  const { t } = useTranslation();

  const priorityLabel = (p) => {
    switch (p) {
      case Priority.NONE:
        return t('none');
      case Priority.LOW:
        return t('low');
      case Priority.MEDIUM:
        return t('medium');
      case Priority.HIGH:
        return t('high');
      default:
        return '';
    }
  };

  const priorityColor = (p) => {
    switch (p) {
      case Priority.NONE:
        return 'primary';
      case Priority.LOW:
        return 'success';
      case Priority.MEDIUM:
        return 'warning';
      case Priority.HIGH:
        return 'error';
      default:
        return 'primary';
    }
  };

  const sort = (s) => {
    setActiveTask(-1);
    switch (s) {
      case SortOrder.ORIGINAL:
        setTasks((prev) => prev.sort((a, b) => a.order - b.order));
        return;
      case SortOrder.PRIORITY:
        setTasks((prev) => prev.sort((a, b) => b.priority - a.priority));
        return;
      case SortOrder.COMPLETED:
        setTasks((prev) =>
          prev.sort((a, b) => {
            if (a.complete && !b.complete) {
              return 1;
            } else if (!a.complete && b.complete) {
              return -1;
            } else {
              return 0;
            }
          }),
        );
        break;
      case SortOrder.ALPHABETICALLY:
        setTasks((prev) => prev.sort((a, b) => a.title.localeCompare(b.title)));
        break;
      default:
        break;
    }
  };

  const renderTasks = () => {
    if (tasks.length === 0) {
      return <div className="m-5 sidesheet-theme">{t('no_tasks')}</div>;
    }
    return (
      <List className="sidesheet-theme">
        {tasks.map((task, i) => (
          <ListItem
            key={i}
            style={{ paddingLeft: '18px', paddingRight: '18px' }}
            className="hover-1"
            onClick={() => setActiveTask(i)}
          >
            <div className="w-full">
              <Grid container rowSpacing={3} className="mb-2">
                <Grid item xs={1}>
                  <Checkbox
                    checked={task.complete}
                    onChange={(e) => {
                      updateTask(i, { complete: e.target.checked });
                      setSaveState(State.SAVING);
                    }}
                  ></Checkbox>
                </Grid>
                <Grid item xs={9}>
                  <Input
                    placeholder={t('title')}
                    onInputChange={(v) => updateTask(i, { title: v })}
                    value={task.title}
                    onBlur={() => setSaveState(State.SAVING)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Popover
                    buttonElement={
                      <Button
                        startIcon={<Iconify icon="proicons:more" />}
                        variant="contained"
                      />
                    }
                    // trigger="click"
                    // showArrow
                    position="bottomLeft"
                    className="w-[180px]"
                  >
                    <div className="p-2 popover-theme">
                      <div className="mb-2 font-semibold">{t('priority')}:</div>
                      <RadioGroup
                        onChange={(e) => {
                          updateTask(i, { priority: e.target.value });
                          setSaveState(State.SAVING);
                        }}
                        value={task.priority}
                        // direction="vertical"
                      >
                        <FormControlLabel
                          value={Priority.NONE}
                          control={<Radio />}
                          label={
                            <Chip
                              color={priorityColor(Priority.NONE)}
                              label={priorityLabel(Priority.NONE)}
                            />
                          }
                        />
                        <FormControlLabel
                          value={Priority.LOW}
                          control={<Radio />}
                          label={
                            <Chip
                              color={priorityColor(Priority.LOW)}
                              label={priorityLabel(Priority.LOW)}
                            />
                          }
                        />
                        <FormControlLabel
                          value={Priority.MEDIUM}
                          control={<Radio />}
                          label={
                            <Chip
                              color={priorityColor(Priority.MEDIUM)}
                              label={priorityLabel(Priority.MEDIUM)}
                            />
                          }
                        />
                        <FormControlLabel
                          value={Priority.HIGH}
                          control={<Radio />}
                          label={
                            <Chip
                              color={priorityColor(Priority.HIGH)}
                              label={priorityLabel(Priority.HIGH)}
                            />
                          }
                        />
                      </RadioGroup>
                      <Button
                        startIcon={<Iconify icon="mdi:delete-outline" />}
                        color="error"
                        // block
                        style={{ marginTop: '12px' }}
                        onClick={() => {
                          setTasks((prev) => prev.filter((_, j) => i !== j));
                          setSaveState(State.SAVING);
                        }}
                      >
                        {t('delete')}
                      </Button>
                    </div>
                  </Popover>
                </Grid>
              </Grid>
              {activeTask === i && (
                <Grid container className="mb-2">
                  <Grid item xs={1}></Grid>
                  <Grid item xs={11}>
                    <Input
                      isTextarea
                      placeholder={t('details')}
                      onInputChange={(v) => updateTask(i, { details: v })}
                      value={task.details}
                      onBlur={() => setSaveState(State.SAVING)}
                    ></Input>
                  </Grid>
                </Grid>
              )}
              <Grid container>
                <Grid item xs={1}></Grid>
                <Grid item xs={11}>
                  {t('priority')}:{' '}
                  <Chip
                    color={priorityColor(task.priority)}
                    label={priorityLabel(task.priority)}
                  />
                </Grid>
              </Grid>
            </div>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mx-5 mb-2 sidesheet-theme">
        <div className="my-menu">
          <Button variant="outlined" color="primary" onClick={handleClick}>
            {t('sort_by')} <Iconify icon="mdi:caret-down" />
          </Button>
          <Menu
            anchorEl={anchorEl}
            id="todo-menu"
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {Object.values(SortOrder).map((order) => (
              <MenuItem
                key={order}
                onClick={() => {
                  setSortOrder(order);
                  sort(order);
                }}
              >
                {t(order)}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <Button
          onClick={() => {
            setTasks((prev) => [
              {
                complete: false,
                details: '',
                title: '',
                priority: Priority.NONE,
                order: prev.length,
              },
              ...prev,
            ]);
          }}
        >
          <Iconify icon="mdi:plus" />
          <span>{t('add_task')}</span>
        </Button>
      </div>
      {renderTasks()}
    </>
  );
}
