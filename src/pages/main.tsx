import React from 'react';
import { connect } from 'react-redux';
import router from 'umi/router';
import { RouteComponentProps } from 'react-router-dom';
import { ComponentExt } from '@/utils/reactExt'
import {
  Spin, message,
  // notification,
} from 'antd';
import { uid } from '@/utils/consts'
// import DragModal from '@/components/DragModal';
import QRCode from 'qrcode.react';

// import { adminRoles } from 'utils/tools';

// import SubAdmin from 'containers/Institution/Tabs/SubAdmin';
// import Password from 'containers/Institution/Tabs/Password';
// import User from 'containers/User';
// import NavBar from '../../components/NavBar';

// import * as authActions from '../../redux/actions/auth';
// import * as userActions from '../../redux/actions/user';
// import * as IMactions from '../../redux/actions/IM';
// import * as institutionActions from '../../redux/actions/institution';
// import * as messageCountActions from '../../redux/actions/messageCount';

import { setHeader } from '@/services/http';
import './main.scss';
import {ConnectState} from "@/models/connect";

interface mainProps extends RouteComponentProps{
  role: string;
  children: React.ReactChild,
  user: Iuser,
  uid: string;
  relationship: Iorg[],
  institution: Iins,
  params: any;
  // userModalPage: string;
  // isShowSubAdmin: boolean;
  // isShowAdminPWD: boolean;
  // isShowUserModal: boolean;
  // relationship: boolean;
  // messageCountActions: object;
}

interface mainState {
  loading: boolean;
  user: Iuser;
  institution: Iins;
  organizationInfo: Iorg;
  department: any;
  relationship: Iorg[];
  isHiddenMain: boolean;
  // isShowSubAdmin: false,
  // isShowAdminPWD: false,
  // isShowUserModal: false,
  role: string;
  accid: string;
  token: string;
  nimInit: boolean;
  isZoom: boolean;
  roles: string[];
  legalRelationship: Iorg[],
}

let timer:any = null;

const initialOrg: Iorg = {
  organizationId: '',
  organizationName: '',
  role: '',
  roles: [],
  status: '',
};

class MainPage extends ComponentExt<mainProps, mainState> {
  state: mainState = {
    loading: true,
    user: {
      username: '',
      roles: [],
      status: '',
      tel: '',
    },
    institution: {
      id: '',
      name: ''
    },
    accid: '',
    token: '',
    organizationInfo: initialOrg,
    department: {},
    relationship: [initialOrg],
    isHiddenMain: false,
    // isShowSubAdmin: false,
    // isShowAdminPWD: false,
    // isShowUserModal: false,
    role: '',
    nimInit: false,
    isZoom: false,
    roles: [],
    legalRelationship: [],
  };

  // getChildContext() {
  //   const {
  //     department, user, institution, relationship,
  //   } = this.state;
  //   return {
  //     user,
  //     department,
  //     institution,
  //     relationship,
  //   };
  // }

  componentDidMount() {
    // const institutionId = localStorage.getItem('institutionId');
      // this.fetchUserInfo(institutionId);
      // this.fetchMessageCount();
    // document.addEventListener('click', this.closeQRCode, false);
    // if (!!localStorage.getItem('onlyConsultations')) {
    //   router.push('/doctor/consultations/1');
    // }
    console.log(this.props);
    this.handleUserInfo();
  }

  // componentWillReceiveProps(nextProps: mainProps) {
  //   const { isShowAdminPWD } = this.props;
  //   this.setState({ isShowSubAdmin: nextProps.isShowSubAdmin });
  //   this.setState({ isShowUserModal: nextProps.isShowUserModal });
  //   if (isShowAdminPWD !== nextProps.isShowAdminPWD) {
  //     this.setState({ isShowAdminPWD: nextProps.isShowAdminPWD });
  //   }
  // }

  componentWillUnmount() {
    clearTimeout(timer);
    timer = null;
    // this.props.imActions.logoutNim();
    // document.removeEventListener('click', this.closeQRCode, false);
  }
  //
  fetchAccid = (role: string): void => {
    const { nimInit } = this.state;
    const { uid } = this.props;
    console.log('uid', uid);
    // console.log('window.nim', window.nim);
    if (!nimInit && !window.nim) {
      this.$api.im.getAccid({
        userId: uid, role },
      )
        .then((res: {
          accid: string;
          token: string;
        }) => {
          // console.log('res', res);
          const { accid, token } = res;
          this.setState({
            accid,
            token,
            nimInit: true,
          });
          // this.props.imActions.connectNim({
          //   uid: accid,
          //   sdktoken: token,
          //   type: 'audio&video',
          // });
        })
        .catch((err: Error) => { message.error(err); });
    }
  }
  //
  // pushNotification = (content: string = '通知') => {
  //   // console.log('content', content);
  //   const key = `open${Date.now()}`;
  //   const btn = (
  //     <div
  //       onClick={() => {
  //         notification.destroy();
  //         router.push('/doctor/reservation/im');
  //       }}
  //       className="notification-link"
  //     >{content}
  //     </div>
  //   );
  //   notification.open({
  //     className: 'confirm__notification',
  //     message: '视频语音',
  //     description: '',
  //     btn,
  //     key,
  //     // onClose: close,
  //     duration: null,
  //   });
  // }
  //
  // closeQRCode = (e: MouseEvent) => {
  //   const { isZoom } = this.state;
  //   const className = e.target.className;
  //   if (className !== 'handleQRCodeZoom' && !isZoom) {
  //     return false;
  //   }
  //   this.setState({
  //     isZoom: !isZoom,
  //   });
  //   return true;
  // }

  onChangeOrganization = (r: Iorg = initialOrg) => {
    const institution = {
      id: r.organizationId,
      name: r.organizationName,
    };
    localStorage.setItem('institutionId', r.organizationId);
    localStorage.setItem('institutionName', r.organizationName);
    // this.props.userActions.setFullUserInfo({ institution });
  }
  //
  // handleCloseSubAdmin = () => {
  //   this.props.institutionActions
  //     .toggleSubAdmin(false);
  // }
  //
  // handlePushPath = (path: string) => {
  //   const { pathname } = this.props.location;
  //   if (path !== pathname && pathname !== '/') {
  //     router.replace(pathname);
  //   } else {
  //     router.replace(path);
  //   }
  // }

  fetchUserInfo = (oId?: string, organizationInfo?: Iorg) => {
    console.log('main fetchUserInfo');
    const isAllOrg = !organizationInfo || Object.keys(organizationInfo).length === 0; // 是否是全部机构
    this.$api.user.getUserInfo({ organizationId: oId})
      .then((res: {
        user: Iuser;
        relationship: Iorg[];
        institution: Iins;
      }) => {
        const {
          user,
          // department,
          institution,
          relationship,
        } = res;
        const { status } = user;
        let role = user.roles.includes('DOCTOR') ? 'DOCTOR' : user.roles[0];
        let roles = user.roles;
        const legalRelationship = status === 'NORMAL' ? relationship
          .filter(r => ['CONFIRMED'].includes(r.status)) : relationship;
        // 包含护士角色则需要与user里的全部角色合并去重，再判断是否是护士科室管理员
        if (legalRelationship[0].roles.includes('OPERATOR')) {
          roles = Array.from(new Set([...legalRelationship[0].roles, ...user.roles]));
          role = roles.includes('OPERATOR_DEPARTMENT_ADMIN') ? 'OPERATOR_DEPARTMENT_ADMIN' : 'OPERATOR';
        } else {
          // role = legalRelationship[0].roles[0];
          role = legalRelationship[0].roles.some(v => v.includes('DOCTOR') || v.includes('ADVISER')) ? 'DOCTOR' : legalRelationship[0].roles[0];
        }
        if (!!organizationInfo && Object.keys(organizationInfo).length > 0) {
          role = organizationInfo.roles.some(v => v.includes('DOCTOR') || v.includes('ADVISER')) ? 'DOCTOR' : organizationInfo.roles[0];
        } else {
          role = localStorage.getItem('role') || role;
        }
        const { pathname } = this.props.location;

        // this.props.userActions.setFullUserInfo({
        //   ...res,
        //   user: {
        //     ...res.user,
        //     roles,
        //   },
        //   legalRelationship,
        // });
        if (role === 'ADMIN') {
          // this.props.institutionActions
          //   .changeSingleInstitutionInfo(institution);
        }
        localStorage.setItem('institutionId',
          oId || legalRelationship[0].organizationId);
        localStorage.setItem('role', role);
        localStorage.setItem('institutionName', institution.name);
        const isHiddenMain = status === 'NORMAL'
          && relationship.every(r => r.status !== 'CONFIRMED');
        const stateOrgInfo = !!organizationInfo
          ? organizationInfo : legalRelationship[0];
        this.setState({
          user,
          role,
          institution,
          // department,
          relationship,
          isHiddenMain,
          organizationInfo: stateOrgInfo,
          loading: false,
          roles: user.roles,
          legalRelationship,
        }, () => {
          // if (!organizationInfo) {
          if (isAllOrg) {
            const headerObj = JSON.stringify({
              // oId: !!oId ? oId : legalRelationship[0].organizationId,
              oId: '',
              uId: uid,
              pId: this.props.params.patientId || null,
              role,
            });
            const ref = Base64.encode(headerObj);
            setHeader(ref);
          }
          const waitingStatus = ['PENDING', 'TO_REVIEW', 'FAILURE'];
          switch (role) {
            case 'ROOT':
            case 'SUB_ROOT':
              // if (!pathname.startsWith('/institution')) {
              // this.handlePushPath('/institution/root');
              // }
              break;
            case 'ADMIN':
              // console.log('pathname', pathname);
              if (!pathname.startsWith('/institution')) {
                // this.handlePushPath(`/institution/index?id=${institution.id}`);
              }
              break;
            case 'OPERATOR':
              if (status === 'PENDING') {
                router.push('/user/status?status=init');
              } else if (status === 'TO_REVIEW') {
                router.push('/user/status?status=review');
              } else if (status === 'FAILURE') {
                router.push('/user/status?status=failure');
              } else if (pathname === '/') {
                // this.handlePushPath('/operate/patients?pageAt=0');
                window.localStorage.setItem('activeNavPath', '/operate/patients');
              }
              if (!waitingStatus.includes(status)) {
                this.fetchAccid('OPERATOR');
              }
              break;
            case 'DOCTOR':
            case 'ASSISTANT':
              if (!waitingStatus.includes(status)) {
                this.fetchAccid('DOCTOR');
                clearTimeout(timer);
                // timer = setTimeout(this.fetchAppointmentMessage, 3 * 1000);
              }
              if (status === 'PENDING') {
                router.push('/user/status?status=init');
              } else if (status === 'TO_REVIEW') {
                router.push('/user/status?status=review');
              } else if (status === 'FAILURE') {
                router.push('/user/status?status=failure');
              } else if (pathname === '/') {
                // 处理登录成功-当前用户仅仅是专家会诊池任职的情况
                if (legalRelationship[0].organizationName === '专家会诊池' && legalRelationship.length === 1) {
                  localStorage.setItem('onlyConsultations', true);
                  // this.handlePushPath('/doctor/consultations/1');
                } else {
                  // this.handlePushPath('/doctor/index/independent');
                }
              } else if (pathname.startsWith('/operate/')) {
                // this.handlePushPath('/doctor/index/independent');
              }
              break;
            case 'ADVISER':
              this.fetchAccid('ADVISER');
              // this.handlePushPath('/doctor/adviser?pageAt=0');
              break;
            case 'ROOT_OPERATOR':
              // this.handlePushPath('/op_admin/nurse_manage');
              break;
            case 'OPERATOR_ADMIN':
              // this.handlePushPath(`/op_admin/nurse_manage/${institution.id}/group?pageAt=1`);
              break;
            case 'OPERATOR_DEPARTMENT_ADMIN':
              this.fetchAccid('OPERATOR');
              // this.handlePushPath(`/op_admin/nurse_manage/${institution.id}/dep?pageAt=1`);
              break;
            default:
              break;
          }
        });
      })
      .catch((err: Error) => {
        message.error(err);
      });
  }

  handleUserInfo = (organizationInfo?: Iorg) => {
    const isAllOrg = !organizationInfo || Object.keys(organizationInfo).length === 0; // 是否是全部机构
    const {
      user,
      params,
      // department,
      institution,
      relationship,
    } = this.props;
    const { status } = user;
    let role = user.roles.includes('DOCTOR') ? 'DOCTOR' : user.roles[0];
    let roles = user.roles;
    const legalRelationship = status === 'NORMAL' ? relationship
      .filter(r => ['CONFIRMED'].includes(r.status)) : relationship;
    // 包含护士角色则需要与user里的全部角色合并去重，再判断是否是护士科室管理员
    if (legalRelationship[0].roles.includes('OPERATOR')) {
      roles = Array.from(new Set([...legalRelationship[0].roles, ...user.roles]));
      role = roles.includes('OPERATOR_DEPARTMENT_ADMIN') ? 'OPERATOR_DEPARTMENT_ADMIN' : 'OPERATOR';
    } else {
      // role = legalRelationship[0].roles[0];
      role = legalRelationship[0].roles.some(v => v.includes('DOCTOR') || v.includes('ADVISER')) ? 'DOCTOR' : legalRelationship[0].roles[0];
    }
    if (!!organizationInfo && Object.keys(organizationInfo).length > 0) {
      role = organizationInfo.roles.some(v => v.includes('DOCTOR') || v.includes('ADVISER')) ? 'DOCTOR' : organizationInfo.roles[0];
    } else {
      role = localStorage.getItem('role') || role;
    }
    // this.props.userActions.setFullUserInfo({
    //   ...res,
    //   user: {
    //     ...res.user,
    //     roles,
    //   },
    //   legalRelationship,
    // });
    if (role === 'ADMIN') {
      // this.props.institutionActions.changeSingleInstitutionInfo(institution);
    }
    const institutionId = organizationInfo ? organizationInfo.organizationId : legalRelationship[0].organizationId;
    localStorage.setItem('institutionId', institutionId);
    localStorage.setItem('role', role);
    localStorage.setItem('institutionName', institution.name);
    const isHiddenMain = status === 'NORMAL' && relationship.every(r => r.status !== 'CONFIRMED');
    const stateOrgInfo = !!organizationInfo ? organizationInfo : legalRelationship[0];
    if (isAllOrg) {
      setHeader({
        oId: '',
        uId: uid,
        pId: params ? params.patientId : null,
        role,
      });
    }
    this.setState(() => ({
      user,
      role,
      institution,
      // department,
      relationship,
      isHiddenMain,
      organizationInfo: stateOrgInfo,
      loading: false,
      roles: user.roles,
      legalRelationship,
    }));
    this.handleUserRole(role, status, legalRelationship);
  }

  handleUserRole = (role: string, status: string, legalRelationship: Iorg[]) => {
    console.log('handleUserRole', role);
    const { pathname } = this.props.location;
    if (status === 'PENDING') {
      router.push('/user/status?status=init');
    } else if (status === 'TO_REVIEW') {
      router.push('/user/status?status=review');
    } else if (status === 'FAILURE') {
      router.push('/user/status?status=failure');
    } else {
      switch (role) {
        case 'ROOT':
        case 'SUB_ROOT':
          // if (!pathname.startsWith('/institution')) {
          // this.handlePushPath('/institution/root');
          // }
          break;
        case 'ADMIN':
          // console.log('pathname', pathname);
          if (!pathname.startsWith('/institution')) {
            // this.handlePushPath(`/institution/index?id=${institution.id}`);
          }
          break;
        case 'OPERATOR':
          // this.handlePushPath('/operate/patients?pageAt=0');
          window.localStorage.setItem('activeNavPath', '/operate/patients');
          this.fetchAccid('OPERATOR');
          break;
        case 'DOCTOR':
        case 'ASSISTANT':
          this.fetchAccid('DOCTOR');
          clearTimeout(timer);
            // timer = setTimeout(this.fetchAppointmentMessage, 3 * 1000);
          if (pathname === '/main') {
            // 处理登录成功-当前用户仅仅是专家会诊池任职的情况
            if (legalRelationship[0].organizationName === '专家会诊池' && legalRelationship.length === 1) {
              localStorage.setItem('onlyConsultations', 'true');
              this.handlePushPath('/doctor/consultations/1');
            } else {
              this.handlePushPath('/doctor/tree/independent');
            }
          }
          break;
        case 'ADVISER':
          this.fetchAccid('ADVISER');
          // this.handlePushPath('/doctor/adviser?pageAt=0');
          break;
        case 'ROOT_OPERATOR':
          // this.handlePushPath('/op_admin/nurse_manage');
          break;
        case 'OPERATOR_ADMIN':
          // this.handlePushPath(`/op_admin/nurse_manage/${institution.id}/group?pageAt=1`);
          break;
        case 'OPERATOR_DEPARTMENT_ADMIN':
          this.fetchAccid('OPERATOR');
          // this.handlePushPath(`/op_admin/nurse_manage/${institution.id}/dep?pageAt=1`);
          break;
        default:
          break;
      }
    }
  }

  handlePushPath = (path: string) => {
    const { pathname } = this.props.location;
    console.log('handlePushPath', pathname);
    if (path !== pathname && pathname !== '/main') {
      router.replace(pathname);
    } else {
      router.replace(path);
    }
  }

  // fetchMessageCount = () => {
  //   api.get('sum/message/count')
  //     .then((res) => {
  //       this.props.messageCountActions.fetchMessageCount(res);
  //     })
  //     .catch((err) => {
  //       message.error(err);
  //       this.props.messageCountActions.fetchMessageCount({});
  //     });
  // }
  //
  // fetchAppointmentMessage = () => {
  //   const { pathname } = this.props.location;
  //   api.get('appointmentvideo/message')
  //     .then((res) => {
  //       const { content } = res;
  //       if (!!content) {
  //         this.pushNotification(content);
  //         if (pathname === '/doctor/reservation/im') {
  //           setTimeout(this.props.imActions.updateImList(true), 30 * 1000);
  //         }
  //       }
  //       clearTimeout(timer);
  //       timer = setTimeout(this.fetchAppointmentMessage, 30 * 1000);
  //     })
  //     .catch(err => message.error(err));
  // }

  render() {
    const {
      loading, relationship,
      // user, institution, organizationInfo, legalRelationship,
      // isShowSubAdmin,  isShowAdminPWD, isShowUserModal,
      isHiddenMain, isZoom, roles,
    } = this.state;
    const doctorAssistant = ['DOCTOR', 'ASSISTANT', 'ADVISER'].some(r => roles.includes(r));
    const {
        children
      // location, params,
    } = this.props;
    let child = <Spin size="large" />;
    if (children) {
      child = React.cloneElement(children, {
        onChangeOrganization: this.onChangeOrganization,
      });
    }
    const iId = localStorage.getItem('institutionId');
    const currentOrg = relationship.filter(r => (r.roles.includes('DOCTOR') || r.roles.includes('ASSISTANT'))
      && r.organizationId === iId)[0];
    const qrCodeUrl = currentOrg ? currentOrg.qrCodeUrl : '';
    const orgName = currentOrg ? currentOrg.organizationName : '';
    // const closeUserModal = () => this.props.userActions.toggleUserModal({ isShow: false });
    // const { institutionId, departmentId, patientId } = params;
    // const OpAdminRoles = ['OPERATOR', 'OPERATOR_DEPARTMENT_ADMIN',
    //   'ROOT_OPERATOR', 'OPERATOR_ADMIN'];
    // const isAdminViewPatient = location.pathname === `/institution/${institutionId}/department/${departmentId}/patient/${patientId}`;
    return !loading ? (
      <div className="main">
        {/*<NavBar*/}
        {/*  uid={uid}*/}
        {/*  role={role}*/}
        {/*  user={user}*/}
        {/*  params={params}*/}
        {/*  location={location}*/}
        {/*  institutionId={institution.id}*/}
        {/*  relationship={relationship}*/}
        {/*  isLogin={isLogin}*/}
        {/*  organizationInfo={organizationInfo}*/}
        {/*  roles={roles}*/}
        {/*  logout={actions.logout}*/}
        {/*  fetchUserInfo={this.fetchUserInfo}*/}
        {/*/>*/}
        <div
          className={(!!doctorAssistant)
            ? 'main__content' : 'main__admin-content'}
        >
          {isHiddenMain ? null : child}
        </div>
        {!!qrCodeUrl && !!doctorAssistant
        && <div
          className={isZoom ? 'qr-code active' : 'qr-code'}
        >
          <QRCode size={40} value={qrCodeUrl} />
          {isZoom && <p>{orgName}</p>}
        </div>
        }
        {/*<DragModal*/}
        {/*  className="sub-admin__modal"*/}
        {/*  title="子管理员"*/}
        {/*  footer={null}*/}
        {/*  width="90%"*/}
        {/*  visible={isShowSubAdmin}*/}
        {/*  onCancel={this.handleCloseSubAdmin}*/}
        {/*  maskClosable={true}*/}
        {/*>*/}
        {/*  <SubAdmin />*/}
        {/*</DragModal>*/}
        {/*<DragModal*/}
        {/*  className="change-password"*/}
        {/*  style={{ top: 100 }}*/}
        {/*  width="90%"*/}
        {/*  visible={isShowAdminPWD}*/}
        {/*  title="修改密码"*/}
        {/*  onCancel={() => this.props.institutionActions.togglePWD(false)}*/}
        {/*  footer={null}*/}
        {/*>*/}
        {/*  <Password />*/}
        {/*</DragModal>*/}
        {/*{ isShowUserModal && (*/}
        {/*  <DragModal*/}
        {/*    className="main__user"*/}
        {/*    style={{ top: 50, borderRadius: 10 }}*/}
        {/*    width="1248"*/}
        {/*    visible={isShowUserModal}*/}
        {/*    title=""*/}
        {/*    onCancel={closeUserModal}*/}
        {/*    footer={null}*/}
        {/*  >*/}
        {/*    {role && (<User*/}
        {/*        role={role}*/}
        {/*        close={closeUserModal}*/}
        {/*        page={userModalPage}*/}
        {/*        legalRelationship={legalRelationship}*/}
        {/*      />)}*/}
        {/*  </DragModal>*/}
        {/*) }*/}
      </div>
    ) : (
      <div className="main">
        <div className="main--loading"><Spin size="large" /></div>
      </div>
    );
  }
}

export default connect(
  ({ user, auth }: ConnectState) => ({
    user: user.user,
    institution: user.institution,
    relationship: user.relationship,
    uid: auth.uid
    // isShowSubAdmin: state.institution.isShowSubAdmin,
    // isShowAdminPWD: state.institution.isShowPWD,
    // isShowUserModal: state.user.isShowUserModal,
    // userModalPage: state.user.userModalPage,
    // relationship: state.user.relationship,
  }),
  // dispatch => ({
  //   actions: bindActionCreators(authActions, dispatch),
  //   userActions: bindActionCreators(userActions, dispatch),
  //   institutionActions: bindActionCreators(institutionActions, dispatch),
  //   imActions: bindActionCreators(IMactions.default, dispatch),
  //   messageCountActions: bindActionCreators(messageCountActions, dispatch),
  // }),
)(MainPage);
