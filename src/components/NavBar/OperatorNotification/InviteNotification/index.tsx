/**
 * Created by wuxiaoran on 2018/4/13.
 */
import React from 'react';
import { Button, message } from 'antd';
import router from 'umi/router';
import { setHeader } from '@/services/http';
import { ComponentExt } from '@/utils/reactExt';
import { noteProps } from '../index';

interface inviteProps {
  note: noteProps,
  refreshNote?: Function,
  user: Iuser,
}

function handleInviteAction(note: noteProps, self: any) {
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
          >拒绝
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


class InviteNotification extends ComponentExt<inviteProps> {

  handleNotification = (status: string) => {
    const { note, user } = this.props;
    this.$api.notification.update({
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
      message.success(`已${status === 'ACCEPT' ? '接受' : '拒绝'}${note.category === 'NOTIFICATION_OF_NEW_BIND_PATIENT'
        ? '患者' : '机构'}邀请`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }).catch((err: string) => {
      message.error(err);
    });
  }

  patientPage = () => {
    const { note } = this.props;
    console.log('note', note);
    this.$api.notification.isValid({
      notifyId: note.id,
      patientId: note.content.patientId,
    })
      .then(() => {
        if (note.category === 'NOTIFICATION_OF_NEW_BIND_PATIENT' && note.status !== 'INVALID') {
          setHeader({
            // oId: 'olLDlK',
            oId: '',
            uId: localStorage.getItem('user'),
            pId: note.content.patientId,
            role: localStorage.getItem('role'),
          });
          router.push(`/doctor/patient/${note.content.patientId}?actionType=confirm`);
        }
      })
      .catch((err: string) => message.error(err));
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
        <p
          className="notification-text"
          onClick={!!note.content.organizationId && !!note.content.patientId? this.patientPage : () => {}}
        >
          {['INVITE_FROM_ORGANIZATION', 'ADD_ADVISOR_DOCTOR'].includes(note.category)
            ? note.content : note.content.content }
        </p>
        {handleInviteAction(note, this)}
      </li>
    );
  }
}

export default InviteNotification;
