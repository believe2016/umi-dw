import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Button, message } from 'antd';
import editIcon from 'assets/img/icon_edit.svg';
import { api } from 'utils/api';

class UserWroking extends Component {
  static propTypes = {
    organizationInfo: PropTypes.object,
    fetchUserInfo: PropTypes.func,
    institutionId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      consultationExpireTimeState: {
        ONE_DAY: '24小时内回复',
        HALF_DAY: '12小时内回复',
      },
      consultationStep: 0,
      deadline: null,
      organizationInfo: {},
    };
  }

  componentWillMount() {
    const { organizationInfo } = this.props;
    this.setState({
      organizationInfo,
    });
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
        consultationStep: 0,
      });
    }
  }

  stopPropagation = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }

  handleConsultationStep = (event, step) => {
    this.stopPropagation(event);
    this.setState({ consultationStep: step });
  }

  handleConfirm = (e, timeStatus, acceptStatus) => {
    this.stopPropagation(e);
    const { institutionId, fetchUserInfo } = this.props;
    const { organizationInfo } = this.state;
    if (acceptStatus === 'START_CONSULTATION' || this.state.deadline) {
      const newOrgInfo = {
        ...organizationInfo,
        consultationAcceptStatus: acceptStatus,
        consultationExpireTimeStatus: timeStatus,
        unAcceptEndTime: this.state.deadline,
      };
      api.patch('consultation/description', {
        orgId: institutionId,
        consultationExpireTimeStatus: timeStatus,
        status: acceptStatus,
        unAcceptEndTime: this.state.deadline,
      })
        .then(() => {
          this.setState({
            consultationStep: 0,
            deadline: null,
            organizationInfo: newOrgInfo,
          }, () => { fetchUserInfo(institutionId, newOrgInfo); });
        })
        .catch(err => message.error(err));
    } else {
      message.warning('请选择暂不会诊的结束时间！');
    }
  }

  handleDeadline = (date) => {
    this.setState({ deadline: new Date(date).getTime() });
  }

  disabledDate = current => (current && current < moment().endOf('day'));

  render() {
    const { consultationAcceptStatus, unAcceptEndTime, consultationExpireTimeStatus } = this.props.organizationInfo;
    const { consultationExpireTimeState } = this.state;
    return (
      <React.Fragment>
        <div className="header__actions-consultation">
          {consultationAcceptStatus === 'NO_CONSULTATION'
            && unAcceptEndTime
            && (
              <div
                className="header__actions-consultation--status"
                onClick={e => this.handleConsultationStep(e, 3)}
              >
                <div>
                  <span className="red-dot" />
                  {' '}
                  暂不会诊
                </div>
                <div>
                  {moment(unAcceptEndTime).format('YYYY.MM.DD')}
                  {' '}
                  (结束)
                </div>
              </div>
            )}
          {consultationAcceptStatus === 'NO_CONSULTATION'
            && !unAcceptEndTime && <div>暂不会诊</div>}
          {(consultationAcceptStatus === 'START_CONSULTATION'
            || consultationAcceptStatus === null)
            && (
              <div
                className="header__actions-consultation--status"
                onClick={e => this.handleConsultationStep(e, 1)}
              >
                <div>
                  <span className="green-dot" />
                  {' '}
                  接受会诊
                </div>
                <div>
                  (
                  {consultationExpireTimeState[consultationExpireTimeStatus]}
                  )
                </div>
              </div>
            )}
          {+this.state.consultationStep !== 0
            && (
              <div className="header__actions-consultation--dropdown">
                <span className="arrow" />
                <div
                  onClick={e => this.handleConfirm(e, 'HALF_DAY', 'START_CONSULTATION')}
                >
                  {consultationAcceptStatus === 'START_CONSULTATION'
                    && consultationExpireTimeStatus === 'HALF_DAY'
                    && <span className="dot green-dot" />
                  }
                  {' '}
                  接受会诊（12小时内回复）
                </div>
                <div
                  onClick={e => this.handleConfirm(e, 'ONE_DAY', 'START_CONSULTATION')}
                >
                  {consultationAcceptStatus === 'START_CONSULTATION'
                    && consultationExpireTimeStatus === 'ONE_DAY'
                    && <span className="dot green-dot" />
                  }
                  {' '}
                  接受会诊（24小时内回复）
                </div>
                {+this.state.consultationStep === 1 && (
                  <div
                    onClick={e => this.handleConsultationStep(e, 2)}
                  >
                    暂不会诊
                  </div>
                )}
                {+this.state.consultationStep === 2
                  && (
                    <div>
                      <div>
                        {consultationAcceptStatus === 'NO_CONSULTATION'
                          && <span className="dot red-dot" />}
                        暂不会诊
                      </div>
                      <div className="over-time">
                        <span>结束时间</span>
                        <DatePicker
                          className="date-picker"
                          size="large"
                          onChange={this.handleDeadline}
                          defaultValue={unAcceptEndTime && moment(unAcceptEndTime)}
                          disabledDate={this.disabledDate}
                        />
                        <Button
                          onClick={e => this.handleConfirm(e, consultationExpireTimeStatus,
                            'NO_CONSULTATION')}
                        >
                          确认
                        </Button>
                      </div>
                    </div>
                  )}
                {+this.state.consultationStep === 3
                  && (
                    <div>
                      {!!unAcceptEndTime ? (
                        <div className="over-time">
                          {consultationAcceptStatus === 'NO_CONSULTATION'
                            && <div className="dot red-dot" />}
                          <span>暂不会诊</span>
                          <span>结束时间</span>
                          <span>
                            (
                            {moment(unAcceptEndTime).format('YYYY.MM.DD')}
                            )
                          </span>
                          <img
                            src={editIcon}
                            alt=""
                            onClick={e => this.handleConsultationStep(e, 2)}
                          />
                        </div>
                      ) : ''}
                    </div>
                  )}
              </div>
            )}
        </div>

      </React.Fragment>
    );
  }
}

export default UserWroking;
