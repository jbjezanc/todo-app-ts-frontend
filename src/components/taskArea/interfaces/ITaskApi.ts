import { Priority } from '../../createTaskForm/enums/Priority';
import { Status } from '../../createTaskForm/enums/Status';

export interface ITaskApi {
  id: string;
  date: string;
  title: string;
  description: string;
  status: `${Status}`; // the string literal converts the enum to union of "todo" | "inProgress" | "completed"
  priority: `${Priority}`; // same thing here: "high" | "normal" | "low"
}
