import { AnyAction, Dispatch } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { UserModelState } from './user';
import { AuthModelState } from './auth';
import { WorkorderModelState } from './workorder';
import { MessageCountState } from './messageCount';
import { InstitutionModelState } from './institution';


export { UserModelState, WorkorderModelState, MessageCountState, InstitutionModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  workorderStatus: WorkorderModelState;
  messageCount: MessageCountState;
  user: UserModelState;
  auth: AuthModelState;
  institution: InstitutionModelState,
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
