/**
 * Created by wuxiaoran on 2018/4/13.
 */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Button, message } from 'antd';
import { hashHistory } from 'react-router';
import { Base64 } from 'js-base64';
import { api, setHeader } from '../../../../utils/api';

function handleInviteAction(note, self) {
  switch (note.status) {
    case 'WAITING':
      return (
        <div>
          <Button
            className="notification-accept"
            onClick={() => self.handleNotification('ACCEPT')}
          >
            {note.category === 'NOTIFICATION_OF_NEW_BIND_PATIENT' ? '知道了' : '同意'}
          </Button>
          <Button
            className="notification-refuse"
            onClick={() => self.handleNotification('REFUSED')}
          >
拒绝
          </Button>
        </div>
      );
    case 'ACCEPT':
      return (<p className="notification--handled">{note.category === 'NOTIFICATION_OF_NEW_BIND_PATIENT' ? '知道了' : '已接受'}</p>);
    case 'REFUSED':
      return (<p className="notification--handled">已拒绝</p>);
    case 'INVALID':
      return (<p className="notification--handled">已失效</p>);
    default:
      return null;
  }
}

class InviteNotification extends Component {
  static propTypes = {
    note: PropTypes.object,
    refreshNote: PropTypes.func,
    user: PropTypes.object,
  };

  handleNotification = (status) => {
    const { note, user } = this.props;
    api.patch('notification', {
      id: note.id,
      sender: note.sender,
      receiver: note.receiver,
      category: note.category,
      role: user.roles[0],
      extra: {
        senderOrgId: note.content.senderOrgId,
        factionCategory: note.content.factionCategory,
        patientId: note.content.patientId,
      },
      status,
    }).then(() => {
      message.success(`已${status === 'ACCEPT' ? '接受' : '拒绝'}${note.category === 'NOTIFICATION_OF_NEW_BIND_PATIENT' ? '患者' : '机构'}邀请`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }).catch((err) => {
      message.error(err);
    });
  }

  patientPage = () => {
    const { note } = this.props;
    console.log('note', note);
    api.get(`notification/valid?notifyId=${note.id}&patientId=${note.content.patientId}`)
      .then(() => {
        if (note.category === 'NOTIFICATION_OF_NEW_BIND_PATIENT' && note.status !== 'INVALID') {
          const headerObj = JSON.stringify({
            // oId: 'olLDlK',
            oId: '',
            uId: localStorage.getItem('user'),
            pId: note.content.patientId,
            role: localStorage.getItem('role'),
          });
          const ref = Base64.encode(headerObj);
          setHeader(ref);
          hashHistory.push(`/doctor/patient/${note
            .content.patientId}?actionType=confirm`);
        }
      })
      .catch(err => message.error(err));
  }

  render() {
    const { note } = this.props;
    return (
      <li
        className="notification--invite"
        // onClick={() => {
        //   if (note.category === 'NOTIFICATION_OF_NEW_BIND_PATIENT' && note.status !== 'INVALID') {
        //     hashHistory.push(`/doctor/patient/${note
        //       .content.patientId}?actionType=confirm`);
        //   }
        // }}
      >
        <p className="notification-text" onClick={note.content.organizationId && note.content.organizationId !== null && note.content.patientId && note.content.patientId !== null ? this.patientPage : () => {}}>
          {['INVITE_FROM_ORGANIZATION', 'ADD_ADVISOR_DOCTOR'].includes(note.category)
            ? note.content : note.content.content }
        </p>
        { handleInviteAction(note, this) }
      </li>
    );
  }
}

export default InviteNotification;
