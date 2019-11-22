import React from 'react';
import { ComponentExt } from '@/utils/reactExt';
import { Tabs, Badge, message } from 'antd';
import { connect } from 'react-redux';
import router from 'umi/router';
import { setHeader } from '@/services/http';
import {ConnectState} from "@/models/connect";

const { TabPane } = Tabs;

interface IProps{
  role: string;
  relationship: Iorg[];
  user: Iuser;
  currentViewRole: string;
  workorderStatus: string;
  opAdminStatus: string;
  messageCount: any;
  location: any;
}

interface IState {
  activeNavWorkorder: string,
  activeNavNurse: string,
  currentViewRole: string,
  pathname: string,
  activeNavDoctorState: string, // 默认tab为签约患者
  count: number, // 小红点
  patientCount: number,
}
class OrganizationsTab extends ComponentExt<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      activeNavWorkorder: 'UNPROCESSED',
      activeNavNurse: 'NURSEMANAGE',
      currentViewRole: '',
      pathname: '',
      activeNavDoctorState: window.localStorage.getItem('activeNavDoctorState') || 'SIGNING', // 默认tab为签约患者
      count: props.messageCount.videoMessageSum + props.messageCount.appointmentMessageCount + props.messageCount.consultationMessageSum, // 小红点
      patientCount: 0,
    };
  }

  componentDidMount() {
    // const { activeNavWorkorder } = this.state;
    // this.props.workorderStatusActions.setWorkorderStatus(activeNavWorkorder);

    // window.localStorage.setItem('activeNavPath', '/op_admin/nurse_manage');
  }

  componentWillMount() {
    const { workorderStatus, messageCount, role } = this.props;
    const {
      singleDoctorMessageSum, doctorMessageSum, assistantMessageSum, advisorMessageSum, videoMessageSum,
      appointmentMessageCount, consultationMessageSum,
    } = messageCount;
    this.setState({
      currentViewRole: this.props.currentViewRole,
      pathname: this.props.location.pathname,
      activeNavWorkorder: workorderStatus || 'UNPROCESSED',
      activeNavNurse: this.props.opAdminStatus || 'NURSEMANAGE',
    });
    const ORDERURL = ['/doctor/reservation/im', '/doctor/reservation/patients', '/doctor/consultations/1'];
    if (ORDERURL.includes(this.props.location.pathname)) {
      window.localStorage.setItem('activeNavDoctorState', 'ORDER');
      this.setState({
        count: singleDoctorMessageSum + doctorMessageSum + assistantMessageSum + advisorMessageSum,
      });
    } else {
      window.localStorage.setItem('activeNavDoctorState', 'SIGNING');
      this.setState({
        count: videoMessageSum + appointmentMessageCount + consultationMessageSum,
      });
    }
    if (['OPERATOR', 'OPERATOR_DEPARTMENT_ADMIN'].includes(role)) {
      this.featchCorrectedCount();
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { currentViewRole, location } = nextProps;
    const { pathname } = location;

    if (currentViewRole !== this.state.currentViewRole) {
      this.setState({
        currentViewRole,
        activeNavWorkorder: 'UNPROCESSED',
        activeNavNurse: 'NURSEMANAGE',
      });
      if (currentViewRole === 'OPERATOR') {
        // this.props.workorderStatusActions.setWorkorderStatus('UNPROCESSED');
        window.localStorage.setItem('activeNavPath', '/operate/patients');
      } else if (currentViewRole === 'OPERATOR_DEPARTMENT_ADMIN') {
        // this.props.workorderStatusActions.setOpadminStatus('NURSEMANAGE');
        window.localStorage.setItem('activeNavPath', '/op_admin/nurse_manage');
      }
    }
    if (pathname !== this.state.pathname) {
      this.updateTab(pathname);
    }
  }

  updateTab = (pathname: string) => {
    this.setState({
      pathname,
    });
    if (pathname.includes('work_manage')) {
      this.setState({
        activeNavNurse: 'WORKMANAGE',
      });
    } else if (pathname.includes('qc')) {
      this.setState({
        activeNavNurse: 'PATIONTQC',
      });
    } else if (pathname.includes('nurse_manage')) {
      // alert(9);
      this.setState({
        activeNavNurse: 'NURSEMANAGE',
      });
    } else if (pathname.includes('operate/patients/corrected')) {
      this.setState({
        activeNavWorkorder: 'CORRECTED',
      });
    } else if (pathname.includes('doctor/index/independent')) {
      window.localStorage.setItem('activeNavDoctorState', 'SIGNING');
      this.setState({
        activeNavDoctorState: 'SIGNING',
      });
    }
  }

  handleChangeTabKey = (tabStateValue: string) => {
    const { messageCount } = this.props;
    const {
      singleDoctorMessageSum, doctorMessageSum, assistantMessageSum, advisorMessageSum, videoMessageSum,
      appointmentMessageCount, consultationMessageSum,
    } = messageCount;
    window.localStorage.setItem('activeNavDoctorState', tabStateValue);
    this.setState({
      activeNavDoctorState: tabStateValue,
    });

    // 切换tab更新小红点
    this.$api.user.getSumMsgCount()
      .then((res) => {
        // this.props.messageCountActions.fetchMessageCount(res);
      })
      .catch(err => message.error(err));

    if (tabStateValue === 'SIGNING') {
      router.push('/doctor/tree/independent');
      window.localStorage.setItem('doctorRoleSider', 'INDEPENDENT');
      this.setState({
        count: videoMessageSum + appointmentMessageCount + consultationMessageSum,
      });
    } else {
      setHeader({
        oId: '',
        uId: window.localStorage.getItem('uid'),
        pId: null,
        role: 'DOCTOR',
      });
      window.localStorage.setItem('role', 'DOCTOR');
      router.push('/doctor/reservation/im');
      this.setState({
        count: singleDoctorMessageSum + doctorMessageSum + assistantMessageSum + advisorMessageSum,
      });
    }
  }

  handleChangeOperateTab = (key: string) => {
    if (key === 'UNPROCESSED') {
      router.push('/operate/patients');
      window.localStorage.setItem('activeNavPath', '/operate/patients');
    } else if (key === 'CORRECTED') {
      router.push('/operate/patients/corrected?pageAt=0');
      window.localStorage.setItem('activeNavPath', '/operate/patients/corrected');
    } else if (key === 'PROCESSED') {
      router.push('/operate/patients');
      window.localStorage.setItem('activeNavPath', '/operate/patients');
    }
    this.setState({ activeNavWorkorder: key });
    // this.props.workorderStatusActions.setWorkorderStatus(key);
  }

  handleChangeNurseAdminTab = (key: string) => {
    // console.log('handleChangeNurseAdminTab', key);
    if (key === 'WORKMANAGE') {
      router.push('/op_admin/work_manage');
      window.localStorage.setItem('activeNavPath', '/op_admin/work_manage');
    } else if (key === 'NURSEMANAGE') {
      const role = localStorage.getItem('role');
      const orgId = localStorage.getItem('institutionId');
      // console.log('role', role);
      if (role === 'OPERATOR_ADMIN') {
        router.push(`/op_admin/nurse_manage/${orgId}/group`);
      } else if (role === 'OPERATOR_DEPARTMENT_ADMIN') {
        router.push(`/op_admin/nurse_manage/${orgId}/dep`);
      } else {
        router.push('/op_admin/nurse_manage');
      }
      window.localStorage.setItem('activeNavPath', '/op_admin/nurse_manage');
    } else {
      router.push('/op_admin/qc'); // 质控列表router
      window.localStorage.setItem('activeNavPath', '/op_admin/qc');
    }
    this.setState({ activeNavNurse: key });
    // this.props.workorderStatusActions.setOpadminStatus(key);
  }

  featchCorrectedCount = () => {
    this.$api.workorder.getCorrectedWorkOrder()
      .then((res) => {
        // console.log('resss', res);
        this.setState({
          patientCount: res.patientCount,
        });
      })
      .catch((err: string) => message.error(err));
  }

  render() {
    const { role } = this.props;
    const {
      activeNavWorkorder, activeNavNurse, currentViewRole, activeNavDoctorState, count, patientCount,
    } = this.state;

    const workorder = [
      {
        statusName: '工单审核',
        status: 'UNPROCESSED',
      }, {
        statusName: '已审核工单',
        status: 'PROCESSED',
      }, {
        statusName: '工单更正',
        status: 'CORRECTED',
      },
    ];
    const operatorNav = [
      {
        statusName: '护士管理',
        status: 'NURSEMANAGE',
      },
      {
        statusName: '患者质控',
        status: 'PATIONTQC',
      },
      {
        statusName: '工单管理',
        status: 'WORKMANAGE',
      },
    ];

    let organizations = <div className="header__link"><div /></div>;
    //  医院nav
    if (['DOCTOR', 'ASSISTANT', 'ADVISER'].includes(role)) {
      // 如果用户仅仅是专家会诊池的医生，那么只显示预约患者tab，且左侧只显示我是会诊医生
      const onlyConsultations = localStorage.getItem('onlyConsultations');
      organizations = (
        <div className="header__link">
          {
            !onlyConsultations && (
              <Badge
                className="header__link__badge"
                count={count || 0}
                overflowCount={999}
                style={activeNavDoctorState === 'SIGNING' ? { left: '222px' } : { left: '110px' }}
              />
            )
          }
          <Tabs
            hideAdd={true}
            onChange={this.handleChangeTabKey}
            activeKey={onlyConsultations ? 'ORDER' : activeNavDoctorState}
            style={{ height: 70 }}
            tabBarStyle={{ maxWidth: 560 }}
            tabPosition="top"
          >
            {
              !onlyConsultations && (
                <TabPane
                  tab="签约患者"
                  key="SIGNING"
                />
              )
            }
            <TabPane
              tab="预约患者"
              key="ORDER"
            />

          </Tabs>
        </div>
      );
    }
    // 护士工单nav
    if ((['OPERATOR'].includes(role))
       || currentViewRole === 'OPERATOR') {
      // let workorderList = workorder;
      // if (!currentViewRole) {
      //   workorderList = workorder.filter(i => i.status !== 'CORRECTED');
      // }
      organizations = (
        <div className="header__link operator">
          <Badge className="header__link__wordbadge" count={patientCount} overflowCount={999} />
          <Tabs
            hideAdd={true}
            onChange={this.handleChangeOperateTab}
            activeKey={activeNavWorkorder}
            tabBarStyle={{ maxWidth: 560 }}
            animated={false}
            tabPosition="top"
          >
            {workorder.map(pane => (
              <TabPane
                tab={pane.statusName}
                key={pane.status}
              />
            ))}
          </Tabs>
        </div>
      );
    }

    // 护士管理员nav 护士管理，患者质控，工单管理
    if ((['ROOT_OPERATOR', 'OPERATOR_ADMIN', 'OPERATOR_DEPARTMENT_ADMIN'].includes(role))
      || currentViewRole === 'OPERATOR_DEPARTMENT_ADMIN') {
      organizations = (
        <div className="header__link operator">
          <Tabs
            hideAdd={true}
            onChange={this.handleChangeNurseAdminTab}
            activeKey={activeNavNurse}
            tabBarStyle={{ maxWidth: 560 }}
            animated={false}
            tabPosition="top"
          >
            {operatorNav.map(pane => (
              <TabPane
                tab={pane.statusName}
                key={pane.status}
              />
            ))}
          </Tabs>
        </div>
      );
    }


    return (
      <React.Fragment>
        {!['ADMIN', 'ROOT', 'SUB_ROOT'].includes(role)
          && organizations
        }
        {['ADMIN', 'ROOT', 'SUB_ROOT'].includes(role)
          && (<div className="header__link" />)
        }
      </React.Fragment>
    );
  }
}

export default connect(
  ({ user, workorderStatus, messageCount }: ConnectState) => ({
    user: user.user,
    workorderStatus: workorderStatus.status,
    opAdminStatus: workorderStatus.currentTab,
    messageCount: messageCount.messageCount,
  }),
  // dispatch => ({
  //   workorderStatusActions: bindActionCreators(workorderStatusActions, dispatch),
  //   messageCountActions: bindActionCreators(messageCountActions, dispatch),
  // }),
)(OrganizationsTab);
