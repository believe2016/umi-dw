import React from 'react';
import {
  Icon, Badge, message,
  Popover, Radio,
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
// @ts-ignore
import { OPERATE_NOTIFICATION_SIZE } from '@/config';
import { ComponentExt } from '@/utils/reactExt';
import { setHeader } from '@/services/http';
import OperatorNotification, {noteProps} from './OperatorNotification';
import OperatorWorking from './OperatorWorking';
import UserWorking from './UserWorking';
import OrganizationsTab from './OrganizationsTab';
import Logo from './Logo';
import DoctorQRCode from './DoctorQRCode';
import SettingDropdown from './SettingDropdown';
import './index.scss';
import { ConnectState } from "@/models/connect";
import { RadioChangeEvent } from "antd/es/radio";

const RadioGroup = Radio.Group;
let timer: any = null;

interface navProps {
  role: string;
  institutionId: string;
  relationship: Iorg[];
  organizationInfo: Iorg;
  uid?: string;
  user: Iuser;
  curHospital: {
    id: string;
    name: string;
  };
  fetchUserInfo?: Function;
  match: any;
  location: any;
  roles: string[];
}

interface navState {
  notifications: noteProps[],
  total: number,
  hasUnRead: boolean,
  current: number,
  isSendRead: boolean,
  organizationInfo: any,
  currentViewRole: string,
}

class NavBar extends ComponentExt<navProps, navState> {

  state = {
    notifications: [],
    total: 0,
    hasUnRead: false,
    current: 1,
    isSendRead: false,
    organizationInfo: {
      role: '',
    },
    currentViewRole: '',
  };

  componentWillMount() {
    const { organizationInfo } = this.props;
    this.setState({
      organizationInfo,
    });
    const { location } = this.props;
    if (!['ROOT', 'ADMIN', 'SUB_ROOT'].includes(this.props.role)) {
      // this.fetchNotification();
      // timer = setInterval(this.fetchNotification,
      //   FETCH_OPERATOR_NOTIFICATION_TIME);
    }
    if (['OPERATOR_DEPARTMENT_ADMIN'].includes(this.props.role)) {
      if (location.pathname.includes('operate/patients')) {
        this.setState({
          currentViewRole: 'OPERATOR',
        });
      } else {
        this.setState({
          currentViewRole: 'OPERATOR_DEPARTMENT_ADMIN',
        });
      }
    }
  }

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(timer);
    timer = null;
  }
  //
  fetchNotification = (params = { pageAt: 0 }) => {
    if (!['ROOT', 'ADMIN', 'SUB_ROOT'].includes(this.props.role)) {
      this.$api.notification.getNotifications({
        pageSize: OPERATE_NOTIFICATION_SIZE,
        ...params,
      })
        .then((res) => {
          const { notifications, total, hasUnRead } = res;
          this.setState({
            notifications,
            total,
            hasUnRead,
            isSendRead: false,
            current: params.pageAt + 1,
          });
        })
        .catch((err: string) => message.error(err));
    }
  }
  //
  // handleMessageRead = () => {
  //   api.patch('notification/staff/read')
  //     .then(() => {
  //       this.setState({
  //         isSendRead: true,
  //         hasUnRead: false,
  //       });
  //     })
  //     .catch(err => message.error(err));
  // }

  handleToggleRole = (e: RadioChangeEvent) => {
    const { institutionId } = this.props;
    setHeader({
      oId: institutionId,
      uId: localStorage.getItem('user'),
      role: e.target.value,
    });

    const value = e.target.value;
    const id = localStorage.getItem('institutionId');
    // localStorage.setItem('role', value);
    if (value === 'OPERATOR_DEPARTMENT_ADMIN') {
      router.push(`/op_admin/nurse_manage/${id}/dep?pageAt=1`);
      window.localStorage.setItem('activeNavPath', '/op_admin/nurse_manage');
    } else {
      router.push('/operate/patients?pageAt=0');
      window.localStorage.setItem('activeNavPath', '/operate/patients');
    }
    this.setState({
      currentViewRole: value,
    }, () => {
      window.location.reload();
    });
  }

  render() {
    const {
      notifications, current, total, organizationInfo, hasUnRead, currentViewRole
    } = this.state;
    const {
      user, curHospital, roles,
      relationship, institutionId, match,
    } = this.props;
    const doctorAssistant = roles.includes('DOCTOR') || roles.includes('ASSISTANT') || roles.includes('ADVISER');
    let departmentId = '';
    let patientId = '';
    if (match) {
      departmentId = match.departmentId;
      patientId = match.departmentId;
    }
    const { role } = organizationInfo;
    const { workOrderAcceptStatus, showId } = user;
    const { avatar } = user;
    const pathname = window.location.hash;
    const userLinks = (
      <div className="header__actions">
        {/* 医生选择会诊时间 */}
        {!!doctorAssistant
          && <UserWorking
            organizationInfo={organizationInfo}
            // fetchUserInfo={fetchUserInfo}
            institutionId={institutionId}
          />
        }
        {/* 护士选择接单 */}
        { ['OPERATOR'].includes(role)
          && <OperatorWorking
            workOrderAcceptStatus={workOrderAcceptStatus}
            // fetchUserInfo={fetchUserInfo}
            institutionId={institutionId}
          />
        }
        {/* 通知小铃铛 */}
        {!['ADMIN', 'ROOT'].includes(role) && (
          <Popover
            placement="bottomRight"
            title={null}
            trigger="click"
            autoAdjustOverflow={false}
            arrowPointAtCenter={true}
            content={(
              <OperatorNotification
                notifications={notifications}
                total={total}
                current={current}
                user={user}
                fetchNotification={this.fetchNotification}
              />
            )}
          >
            <Badge dot={hasUnRead}>
              <Icon
                style={{ color: '#fff', fontSize: 25, marginTop: '-12px' }}
                type="bell"
                onClick={hasUnRead ? () => {}
                  // this.handleMessageRead
                  : () => {}}
              />
              <span className="header__bell-text">消息</span>
            </Badge>
          </Popover>
        ) }
        {/* 下拉菜单 */}
        <SettingDropdown
          role={role}
          avatar={avatar}
          roles={roles}
        />
      </div>
    );
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const hidePath = ['/doctor/patient/', '/doctor/reservation/patient/', '/operate/patient/'];
    if (match && match.institutionId) {
      hidePath.push(`/institution/${match.institutionId}/department/${departmentId}/patient/${patientId}`,)
    }
    const isHide = (path: string) => hidePath.some(hide => path.includes(hide));
    return isHide(pathname) ? null
      : (
        <div className="header">
          <div
            className="header__title"
            style={{
              flex: !!doctorAssistant ? '0 0 307px' :
                (['OPERATOR_DEPARTMENT_ADMIN'].includes(this.props.role) ? '0 0 270px' : '0 0 170px') }}
          >
            {/* logo */}
            {<Logo role={role} institutionId={institutionId} curHospital={curHospital} />}
            {/* 科室管理员-两个视图角色 必须用this.props.role */}
            {
              roles.includes('OPERATOR_DEPARTMENT_ADMIN')
              && <RadioGroup
                onChange={this.handleToggleRole}
                value={currentViewRole}
                buttonStyle={'solid'}
                className="header__radio"
              >
                <Radio style={radioStyle} value={'OPERATOR_DEPARTMENT_ADMIN'}>
                  管理员视图
                </Radio>
                <Radio style={radioStyle} value={'OPERATOR'}>
                  护士视图
                </Radio>
              </RadioGroup>
              }

            {/* 二维码 */}
            {
              doctorAssistant && (
                <DoctorQRCode
                  organizationInfo={organizationInfo}
                  showId={showId}
                  relationship={relationship}
                />)
              }
          </div>
          <OrganizationsTab
            role={role || ''}
            relationship={relationship}
            location={location}
            currentViewRole={currentViewRole}
          />
        {/*{isAuthenticated ? userLinks : guestLinks }*/}
        {userLinks}
      </div>
    );
  }
}

export default connect(
  ({ user, institution }: ConnectState) => ({
    user: user.user,
    curHospital: institution.curHospital,
  }),
)(NavBar);
