import React from 'react';
import { ComponentExt } from '@/utils/reactExt';
import { initialOrg } from '@/utils/consts';

import { message } from 'antd';

interface Iprops {
  workOrderAcceptStatus?: string,
  institutionId: string,
  fetchUserInfo?: Function,
}

interface IState {
  operateConsultationStep: number,
  organizationInfo: Iorg;
}

class OperatorWorking extends ComponentExt<Iprops, IState> {

  state = {
    operateConsultationStep: 0,
    organizationInfo: initialOrg ,
  };

  componentDidMount() {
    document.addEventListener('click', this.hideConsultation);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideConsultation);
  }

  hideConsultation = (e: any) => {
    if (!e.target.className.startsWith('ant-calendar')) {
      this.setState({
        operateConsultationStep: 0,
      });
    }
  }


  handleOpearteConsultationStep = (e: any, step: number) => {
    this.setState({ operateConsultationStep: step });
  }

  handleAcceptOrder = (status: string) => {
    const { institutionId, fetchUserInfo } = this.props;
    const { organizationInfo } = this.state;
    this.$api.operator.updateWorkStatus({ status })
      .then(() => {
        fetchUserInfo(institutionId, organizationInfo);
      })
      .catch((err: string) => message.error(err));
  }

  render() {
    const { workOrderAcceptStatus } = this.props;
    return (
      <div>
        <div className="header__actions-consultation header__actions-consultation-operate">
          {
            workOrderAcceptStatus === 'START_ACCEPT_ORDER'
            && (
              <div
                className="header__actions-consultation--status"
                onClick={e => this.handleOpearteConsultationStep(e, 2)}
              >
                <span className="green-dot" />
                开始接单
              </div>
            )
          }
          {
            (workOrderAcceptStatus === 'NO_ACCEPT_ORDER'
              || workOrderAcceptStatus === null)
            && (
              <div
                className="header__actions-consultation--status"
                onClick={e => this.handleOpearteConsultationStep(e, 1)}
              >
                <span className="red-dot" />
                暂不接单
              </div>
            )
          }
          {this.state.operateConsultationStep !== 0
            && (
              <div className="header__actions-consultation--dropdown">
                <span className="arrow" />
                <div
                  onClick={() => this.handleAcceptOrder('START_ACCEPT_ORDER')}
                >
                  {workOrderAcceptStatus === 'START_ACCEPT_ORDER'
                    && <span className="dot green-dot" />
                  }
                  开始接单
                </div>
                <div
                  onClick={() => this.handleAcceptOrder('NO_ACCEPT_ORDER')}
                >
                  {workOrderAcceptStatus === 'NO_ACCEPT_ORDER'
                    && <span className="dot red-dot" />
                  }
                  暂不接单
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default OperatorWorking;
