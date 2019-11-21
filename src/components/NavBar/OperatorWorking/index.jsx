import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { api } from 'utils/api';
import { message } from 'antd';

class OperatorWorking extends Component {
  static propTypes = {
    workOrderAcceptStatus: PropTypes.string,
    institutionId: PropTypes.string,
    fetchUserInfo: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      operateConsultationStep: 0,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.hideConsultation);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideConsultation);
  }

  hideConsultation = (e) => {
    if (!e.target.className.startsWith('ant-calendar')) {
      this.setState({
        operateConsultationStep: 0,
      });
    }
  }

  stopPropagation = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }

  handleOpearteConsultationStep = (event, step) => {
    this.stopPropagation(event);
    this.setState({ operateConsultationStep: step });
  }
  
  handleAcceptOrder = (status) => {
    const { institutionId, fetchUserInfo } = this.props;
    const { organizationInfo } = this.state;
    api.patch('operator/workorder/status', { status })
      .then(() => {
        fetchUserInfo(institutionId, organizationInfo);
      })
      .catch(err => message.error(err));
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
