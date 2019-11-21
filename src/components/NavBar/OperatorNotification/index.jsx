/**
 * Created by wuxiaoran on 2018/4/13.
 */
import React from 'react';
import { PropTypes } from 'prop-types';
import { Pagination } from 'antd';
// import { hashHistory } from 'react-router';
import { OPERATE_NOTIFICATION_SIZE } from 'config';
import InviteNotification from './InviteNotification';
import ModifyNotification from './ModifyNotification';
import './index.scss';


function OperatorNotification(props) {
  const {
    notifications, total, current, user,
  } = props;
  return (
    <div className="notification">
      <ul className="notification-lists">
        {
        notifications.length > 0
          ? notifications.map((note) => {
            switch (note.category) {
              case 'NOTIFICATION_OF_NEW_BIND_PATIENT':
              case 'INVITE_FROM_ORGANIZATION':
              case 'FACTION_INVITE':
              case 'ADD_ADVISOR_DOCTOR':
                return (
                  <InviteNotification
                    key={note.id}
                    note={note}
                    user={user}
                    refreshNote={props.fetchNotification}
                  />
                );
              case 'MODIFY_PATIENT_ARCHIVE':
                return (
                  <ModifyNotification
                    key={note.id}
                    note={note}
                  />
                );
              
              case 'REMOVE_STAFF_FROM_ORGANIZATION':
              default:
                return <li
                  key={note.id}
                  // onClick={() => {
                  //   if (note.category === 'NOTIFICATION_OF_NEW_BIND_PATIENT') {
                  //     hashHistory.push(`/doctor/patient/${note
                  //       .sender}?actionType=confirm`);
                  //   }
                  // }}
                >
                  {note.content}
                </li>;
            }
          })
          : (<li>暂无消息</li>)
      }
      </ul>
      { notifications.length > 0 && (
      <Pagination
        total={total}
        current={current}
        pageSize={OPERATE_NOTIFICATION_SIZE}
        onChange={pageAt => props.fetchNotification({ pageAt: pageAt - 1 })}
      />
      ) }
    </div>
  );
}

OperatorNotification.propTypes = {
  fetchNotification: PropTypes.func,
  notifications: PropTypes.array,
  total: PropTypes.number,
  current: PropTypes.number,
  user: PropTypes.object,
};

export default OperatorNotification;
