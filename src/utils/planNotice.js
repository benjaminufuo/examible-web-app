import { store } from "../global/store";
import { setPlanEndedNotice } from "../global/slice";

// Ask PlanEndedModal to show (it waits if an exam is in progress)
export const showPlanEndedNotice = () =>
  store.dispatch(setPlanEndedNotice(true));
