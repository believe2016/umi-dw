import React from 'react';
import {
  Icon, Menu, Dropdown, Avatar,
} from 'antd';
import {ConnectState} from "@/models/connect";
import {ComponentExt} from "@/utils/reactExt";
import { AnyAction, Dispatch } from 'redux';
// @ts-ignore
import { defaultAvatar } from '@/config';
import subAdmin from '@/assets/img/nav_bar/sub_admin.svg';
import { connect } from 'react-redux';
import info from '@/assets/img/nav_bar/info.svg';
import upperLowerDoctor from '@/assets/img/nav_bar/upper_lower_doctor.svg';
import msgHistory from '@/assets/img/nav_bar/msg_history.svg';
import farDoctor from '@/assets/img/nav_bar/far_doctor.svg';
import price from '@/assets/img/nav_bar/price.svg';
import visitingTime from '@/assets/img/nav_bar/visitingTime.svg';
import changePassword from '@/assets/img/nav_bar/lock.svg';
import logoutIcon from '@/assets/img/nav_bar/logout.svg';
import score from '@/assets/img/nav_bar/score.svg';
import MultiMsgHistory from '../MultiMsgHistory';
// import * as actions from '../../../redux/actions/user';
// import * as institutionActions from '../../../redux/actions/institution';

interface IProps {
  role: string,
  avatar?: string,
  roles: string[],
  isShowMsgHistory: boolean,
  dispatch: Dispatch<AnyAction>
}

class SettingDropdown extends ComponentExt<IProps> {

  state = {
    isShowMsgHistory: false,
  };

  componentWillReceiveProps(nextProps: IProps) {
    const { isShowMsgHistory } = this.props;
    if (isShowMsgHistory !== nextProps.isShowMsgHistory) {
      console.log('isShowMsgHistory', nextProps.isShowMsgHistory);
      this.setState({ isShowMsgHistory: nextProps.isShowMsgHistory });
    }
  }

  handleDoctorClick = (item: any) => {
    console.log('item', item);
    if (item.key !== 'mmh') {
      // this.props.actions.toggleUserModal({
      //   isShow: true,
      //   page: item.key,
      // });
    } else {
      const { isShowMsgHistory } = this.props;
      console.log('群发历史');
      // this.props.actions.toggleMsgHistory(!isShowMsgHistory);
    }
  }

  logoutSystem = () => {
    this.props.dispatch({
      type: 'auth/logout',
    });
  }

  render() {
    const {
      role, avatar, roles,
    } = this.props;
    const { isShowMsgHistory } = this.state;
    const doctorAssistant = roles.includes('DOCTOR') || roles.includes('ASSISTANT') || roles.includes('ADVISER');
    // console.log(112233, role);
    const tabName = [
      {
        key: 'info',
        value: '个人资料',
        src: info,
      }, {
        key: 'score',
        value: '我的积分',
        src: score,
      }, {
        key: 'price',
        value: '收费标准',
        src: price,
      }, {
        key: 'upperLower',
        value: '我的上下级医生',
        src: upperLowerDoctor,
      }, {
        key: 'farDoctor',
        value: '未来医生',
        src: farDoctor,
      }, {
        key: 'visitingTime',
        value: '出诊时间',
        src: visitingTime,
      }, {
        key: 'mmh',
        value: '群发历史',
        src: msgHistory,
      }, {
        key: 'reset',
        value: '修改密码',
        src: changePassword,
      },
    ];
    const operatorTabName = [
      {
        key: 'info',
        value: '个人资料',
        src: info,
      },
      {
        key: 'reset',
        value: '修改密码',
        src: changePassword,
      },
    ];
    const Logout = (
      <div className="logout pointer" onClick={this.logoutSystem}>
        <img
          src={logoutIcon}
          alt=""
          style={{
            verticalAlign: 'middle',
            marginRight: 5,
          }}
        />
        退出登录
      </div>
    );
    return (
      <React.Fragment>
        <Dropdown
          overlayClassName="header__dropdown"
          placement="bottomRight"
          overlay={['ADMIN', 'ROOT', 'SUB_ROOT', 'ROOT_OPERATOR', 'OPERATOR_ADMIN'].includes(role) ? (
            <Menu style={{ textAlign: 'left' }}>
              {['ROOT111'].includes(role) && (
                <Menu.Item>
                  <a
                    onClick={() => {}}
                    // this.props.institutionActions.toggleSubAdmin(true)
                  >
                    <img src={subAdmin} alt="" />
                    子管理员
                  </a>
                </Menu.Item>
              )}
              <Menu.Item>
                <a
                  onClick={() => {
                    // this.props.institutionActions.togglePWD(true);
                  }}
                >
                  <img src={changePassword} alt="" />
                  修改密码
                </a>
              </Menu.Item>
              <Menu.Item>
                {Logout}
              </Menu.Item>
            </Menu>
          ) : (!!doctorAssistant
            ? (
              <Menu style={{ textAlign: 'center' }}>
                {tabName.map((item, idx) => (
                  <Menu.Item key={idx}>
                    <a
                      onClick={() => this.handleDoctorClick(item)}
                    >
                      <img src={item.src} alt="" />
                      {item.value}
                    </a>
                  </Menu.Item>
                ))}
                <Menu.Item>{Logout}</Menu.Item>
              </Menu>
            ) : (
              <Menu style={{ textAlign: 'center' }}>
                {operatorTabName.map(item => (
                  <Menu.Item key={item.key}>
                    <a
                      onClick={() => {}}
                    // this.props.actions.toggleUserModal({
                        // isShow: true,
                        // page: item.key,
                    >
                      <img src={item.src} alt="" />
                      {item.value}
                    </a>
                  </Menu.Item>
                ))}
                <Menu.Item>{Logout}</Menu.Item>
              </Menu>
            )
          )}
        >
          <div className="nav__avatar">
            <Avatar
              className={['DOCTOR', 'ASSISTANT'].includes(role) ? 'pass' : ''}
              src={!!avatar
                ? `${avatar}?x-oss-process=image/auto-orient,1/resize,m_lfit,h_60,w_60`
                : defaultAvatar}
              icon={avatar || 'user'}
            />
            <span>
              设置<Icon type="down" />
            </span>
          </div>
        </Dropdown>
        { isShowMsgHistory && (
          <MultiMsgHistory
            close={() => {}}
            // this.props.actions.toggleMsgHistory(false)
          />
        )}
      </React.Fragment>
    );
  }
}

export default connect(
  ({ user }: ConnectState) => ({
    user: user.user,
    isShowMsgHistory: user.isShowMsgHistory,
  }),
  // dispatch => ({
  //   actions: bindActionCreators(actions, dispatch),
  //   institutionActions: bindActionCreators(institutionActions, dispatch),
  // }),
)(SettingDropdown);
