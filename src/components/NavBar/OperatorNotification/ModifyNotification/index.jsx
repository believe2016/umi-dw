/**
 * Created by wuxiaoran on 2018/9/20.
 */
import React from 'react';
import { PropTypes } from 'prop-types';
import { hashHistory } from 'react-router';
import { message } from 'antd';
import { Base64 } from 'js-base64';
import { api, setHeader } from '../../../../utils/api';

function ModifyNotification({ note }) {
  const { changeColorTexts, content } = note.content;
  const contentArray = content.split(/{\d{1}}/);
  changeColorTexts.forEach((text, idx) => {
    const position = idx === 0 ? 1 : idx === 1 ? 3 : 5;
    contentArray.splice(position, 0,
      `<span style='color: ${text.color}'>${text.value}</span>`);
  });
  function patientPage() {
    api.get(`notification/valid?notifyId=${note.id}&patientId=${note.content.patientId}`)
      .then(() => {
        if (note.status !== 'INVALID') {
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
  /* eslint-disable react/no-danger */
  return (
    <li
      dangerouslySetInnerHTML={{ __html: contentArray.join('') }}
      // onClick={() => {
      //   if (note.status !== 'INVALID') {
      //     hashHistory.push(`/doctor/patient/${note
      //       .content.patientId}?actionType=confirm`);
      //   }
      // }}
      onClick={note.content.organizationId && note.content.organizationId !== null && note.content.patientId && note.content.patientId !== null ? patientPage : () => {}}
    />
  );
  /* eslint-disable react/no-danger */
}
ModifyNotification.propTypes = { note: PropTypes.object };

export default ModifyNotification;
