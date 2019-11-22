import React from 'react';
import { connect } from 'react-redux';
import router from 'umi/router';
import { RouteComponentProps } from 'react-router-dom';
import { ComponentExt } from '@/utils/reactExt'
import {ConnectState} from "@/models/connect";
import { setHeader } from '@/services/http';
import {
  Spin, message,
} from 'antd';
import { uid, initialOrg } from '@/utils/consts'
import QRCode from 'qrcode.react';
import './main.scss';

interface mainProps extends RouteComponentProps{
  role: string;
  children: React.ReactElement,
  user: Iuser,
  uid: string;
  relationship: Iorg[],
  legalRelationship: Iorg[],
  institution: Iins,
  match: any;
}

interface mainState {
  loading: boolean;
  user: Iuser;
  institution: Iins;
  organizationInfo: Iorg;
  department: any;
  relationship: Iorg[];
  isHiddenMain: boolean;
  role: string;
  accid: string;
  token: string;
  nimInit: boolean;
  isZoom: boolean;
  roles: string[];
  legalRelationship: Iorg[],
}

let timer:any = null;

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
    role: '',
    nimInit: false,
    isZoom: false,
    roles: [],
    legalRelationship: [],
  };

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

  componentWillUnmount() {
    clearTimeout(timer);
    timer = null;
    // this.props.imActions.logoutNim();
    // document.removeEventListener('click', this.closeQRCode, false);
  }
  fetchAccid = (role: string): void => {
    const { nimInit } = this.state;
    const { uid } = this.props;
    console.log('uid', uid);
    // console.log('window.nim', window.nim);
    if (!nimInit && !window.nim) {
      this.$api.im.getAccid({userId: uid, role })
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
  onChangeOrganization = (r: Iorg = initialOrg) => {
    const institution = {
      id: r.organizationId,
      name: r.organizationName,
    };
    localStorage.setItem('institutionId', r.organizationId);
    localStorage.setItem('institutionName', r.organizationName);
    // this.props.userActions.setFullUserInfo({ institution });
  }
  handleUserInfo = (organizationInfo?: Iorg) => {
    const isAllOrg = !organizationInfo || Object.keys(organizationInfo).length === 0; // 是否是全部机构
    const {
      user,
      match,
      legalRelationship,
      // department,
      institution,
      relationship,
    } = this.props;
    const { status } = user;
    const role = localStorage.getItem('role') || '';
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
    localStorage.setItem('institutionName', institution.name);
    const isHiddenMain = status === 'NORMAL' && relationship.every(r => r.status !== 'CONFIRMED');
    const stateOrgInfo = !!organizationInfo ? organizationInfo : legalRelationship[0];
    if (isAllOrg) {
      setHeader({
        oId: '',
        uId: uid,
        pId: match ? match.patientId : null,
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


  render() {
    const {
      loading, relationship,
      isHiddenMain, isZoom, roles,
    } = this.state;
    const doctorAssistant = ['DOCTOR', 'ASSISTANT', 'ADVISER'].some(r => roles.includes(r));
    const {
        children
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
    return !loading ? (
      <div className="main">
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
    legalRelationship: user.legalRelationship,
    uid: auth.uid
  }),
)(MainPage);
