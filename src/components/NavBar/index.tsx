import React, { Component } from 'react';
import {
  Icon, Badge,
  Popover, message, Radio,
} from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { ComponentExt } from '@/utils/reactExt';

import {
  OPERATE_NOTIFICATION_SIZE,
  FETCH_OPERATOR_NOTIFICATION_TIME,
} from '@/config';
import { api, setHeader } from '@/utils/api';
import { Base64 } from 'js-base64';
import logoutIcon from 'assets/img/nav_bar/logout.svg';
import OperatorNotification from './OperatorNotification';
import OperatorWorking from './OperatorWorking';
import UserWorking from './UserWorking';
import OrganizationsTab from './OrganizationsTab';
import Logo from './Logo';
import DoctorQRCode from './DoctorQRCode';
import SettingDropdown from './SettingDropdown';
import './index.scss';

const RadioGroup = Radio.Group;
let timer: any = null;

interface navProps {
  role: string;
  institutionId: string;
  relationship: any;
  organizationInfo: object;
  uid: string;
  user: object;
  isAuthenticated: boolean;
  logout: Function;
  location: object;
  params: object;
  hospitalIndex: object;
  fetchUserInfo: Function;
  roles: string[];
}

class NavBar extends ComponentExt<navProps> {

  state = {
    notifications: [],
    total: 0,
    hasUnRead: false,
    current: 1,
    isSendRead: false,
    organizationInfo: {},
    currentViewRole: '',
  };

  componentWillMount() {
    const { organizationInfo } = this.props;
    this.setState({
      organizationInfo,
    });
    const { location } = this.props;
    if (!['ROOT', 'ADMIN', 'SUB_ROOT'].includes(this.props.role)) {
      this.fetchNotification();
      timer = setInterval(this.fetchNotification,
        FETCH_OPERATOR_NOTIFICATION_TIME);
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

  fetchNotification = (params = { pageAt: 0 }) => {
    if (!['ROOT', 'ADMIN', 'SUB_ROOT'].includes(this.props.role)) {
      api.get('notification', {
        params: {
          pageSize: OPERATE_NOTIFICATION_SIZE,
          ...params,
        },
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
        .catch(err => message.error(err));
    }
  }

  handleMessageRead = () => {
    api.patch('notification/staff/read')
      .then(() => {
        this.setState({
          isSendRead: true,
          hasUnRead: false,
        });
      })
      .catch(err => message.error(err));
  }

  handleToggleRole = (e) => {
    const { institutionId } = this.props;
    const headerObj = JSON.stringify({
      oId: institutionId,
      uId: localStorage.getItem('user'),
      role: e.target.value,
    });
    const ref = Base64.encode(headerObj);
    setHeader(ref);

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
      notifications, current, total, organizationInfo,
      hasUnRead, currentViewRole,
    } = this.state;
    const {
      isAuthenticated, user, logout, hospitalIndex,
      location, relationship, institutionId, params,
      fetchUserInfo, roles,
    } = this.props;
    const doctorAssistant = roles.includes('DOCTOR') || roles.includes('ASSISTANT') || roles.includes('ADVISER');
    const { departmentId, patientId } = params;
    const { role } = organizationInfo;
    const { workOrderAcceptStatus, showId } = user;
    const { status, avatar } = user;
    const { pathname } = location;
    // console.log('role43', role);
    const Logout = (
      <div className="logout pointer" onClick={() => logout()}>
        <img
          src={logoutIcon}
          alt=""
          style={{
            verticalAlign: 'middle',
            marginRight: 5,
          }}
        />退出登录
      </div>
    );
    const userLinks = status === 'NORMAL' ? (
      <div className="header__actions">
        {/* 医生选择会诊时间 */}
        {!!doctorAssistant
          && <UserWorking
            organizationInfo={organizationInfo}
            fetchUserInfo={fetchUserInfo}
            institutionId={institutionId}
          />
        }
        {/* 护士选择接单 */}
        { ['OPERATOR'].includes(role)
          && <OperatorWorking
            workOrderAcceptStatus={workOrderAcceptStatus}
            fetchUserInfo={fetchUserInfo}
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
                onClick={hasUnRead ? this.handleMessageRead : () => {}}
              />
              <span className="header__bell-text">消息</span>
            </Badge>
          </Popover>
        ) }
        {/* 下拉菜单 */}
        <SettingDropdown
          role={role}
          logout={logout}
          avatar={avatar}
          roles={roles}
        />
      </div>
    ) : <div className="header__actions">{ Logout }</div>;
    const guestLinks = (
      <div className="header__actions">
        <Link to="/login">登录</Link>
      </div>
    );
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const hidePath = ['/doctor/patient/',
      `/institution/${params.institutionId}/department/${departmentId}/patient/${patientId}`,
      '/doctor/reservation/patient/', '/operate/patient/'];
    const isHide = path => hidePath.some(hide => path.includes(hide));
    return isHide(pathname) ? null
      : (<div className="header">
        <div
          className="header__title"
          style={{ flex: !!doctorAssistant ? '0 0 307px' : (['OPERATOR_DEPARTMENT_ADMIN'].includes(this.props.role) ? '0 0 270px' : '0 0 170px') }}
        >
          {/* logo */}
          {status === 'NORMAL' && <Logo role={role} institutionId={institutionId} hospitalIndex={hospitalIndex} />}
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
            !!doctorAssistant
              && status === 'NORMAL' && <DoctorQRCode
                organizationInfo={organizationInfo}
                showId={showId}
                relationship={relationship}
              />
            }
        </div>
        <OrganizationsTab
          role={role}
          relationship={relationship}
          user={user}
          location={location}
          organizationInfo={organizationInfo}
          status={status}
          currentViewRole={currentViewRole}
        />
        {isAuthenticated ? userLinks : guestLinks }
      </div>);
  }
}

export default connect(
  state => ({
    user: state.user.user,
    // hospitalIndex: state.institution.hospitalIndex,
  }),
)(NavBar);
