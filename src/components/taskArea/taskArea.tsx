import {
  Grid,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  FC,
  ReactElement,
  useContext,
  useEffect,
} from 'react';
import {
  useQuery,
  useMutation,
} from '@tanstack/react-query';
import { format } from 'date-fns';

import { TaskCounter } from '../taskCounter/taskCounter';
import { Task } from '../task/task';
import { IUpdateTask } from '../createTaskForm/interfaces/IUpdateTask';
import { Status } from '../createTaskForm/enums/Status';
import { ITaskApi } from './interfaces/ITaskApi';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import { countTasks } from './helpers/countTasks';
import { TaskStatusChangedContext } from '../../context';

export const TaskArea: FC = (): ReactElement => {
  const tasksUpdatedContext = useContext(
    TaskStatusChangedContext,
  );

  const { isPending, isError, data, refetch } =
    useQuery({
      queryKey: ['tasks'],
      // this loads as soon as the component loads
      queryFn: async () => {
        return await sendApiRequest<ITaskApi[]>(
          'http://localhost:3200/tasks',
          'GET',
        );
      },
    });

  // update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (data: IUpdateTask) => {
      return sendApiRequest(
        'http://localhost:3200/tasks',
        'PUT',
        data,
      );
    },
  });

  useEffect(() => {
    refetch(); // whenever a task is updated, just refetch all the tasks
  }, [tasksUpdatedContext.updated]);

  useEffect(() => {
    // whenever a task is updated SUCCESSFULLY, we
    if (updateTaskMutation.isSuccess) {
      tasksUpdatedContext.toggle();
    }
  }, [updateTaskMutation.isSuccess]);

  function onStatusChangeHandler(
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) {
    updateTaskMutation.mutate({
      id,
      status: e.target.checked
        ? Status.inProgress
        : Status.todo,
    });
  }

  function markCompleteHandler(
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    updateTaskMutation.mutate({
      id,
      status: Status.completed,
    });
  }

  return (
    <Grid item md={8} px={4}>
      <Box mb={8} px={4}>
        <h2>
          Status of Your Tasks as On{' '}
          {format(new Date(), 'PPPP')}
        </h2>
      </Box>
      <Grid
        container
        display="flex"
        justifyContent="center"
      >
        <Grid
          item
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          md={10}
          xs={12}
          mb={8}
        >
          <TaskCounter
            count={
              data
                ? countTasks(data, Status.todo)
                : undefined
            }
            status={Status.todo}
          />
          <TaskCounter
            count={
              data
                ? countTasks(data, Status.inProgress)
                : undefined
            }
            status={Status.inProgress}
          />
          <TaskCounter
            count={
              data
                ? countTasks(data, Status.completed)
                : undefined
            }
            status={Status.completed}
          />
        </Grid>
        <Grid
          item
          display="flex"
          flexDirection="column"
          xs={10}
          md={8}
        >
          <>
            {isError && (
              <Alert severity="error">
                There was an error fetching your tasks
              </Alert>
            )}
            {!isError &&
              Array.isArray(data) &&
              data.length === 0 && (
                <Alert severity="warning">
                  You do not have any tasks created
                  yet. Start by creating some.
                </Alert>
              )}
            {isPending ? (
              <LinearProgress />
            ) : (
              Array.isArray(data) &&
              data.length > 0 &&
              data.map((each, index) => {
                return each.status === Status.todo ||
                  each.status === Status.inProgress ? (
                  <Task
                    key={index + each.priority}
                    id={each.id}
                    title={each.title}
                    description={each.description}
                    date={new Date(each.date)}
                    status={each.status}
                    priority={each.priority}
                    onStatusChange={
                      onStatusChangeHandler
                    }
                    onClick={markCompleteHandler}
                  />
                ) : (
                  false
                );
              })
            )}
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};
