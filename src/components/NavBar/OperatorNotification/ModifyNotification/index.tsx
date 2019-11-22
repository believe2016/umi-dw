/**
 * Created by wuxiaoran on 2018/9/20.
 */
import React from 'react';
import router from 'umi/router';
import { message } from 'antd';
import { setHeader } from '@/services/http';
import { noteProps } from '../index';
import notification from '@/services/api/notification'
interface modifyNoteProps {
  note: noteProps;
}

function ModifyNotification({ note }: modifyNoteProps) {
  const { changeColorTexts, content } = note.content;
  const contentArray = content.split(/{\d{1}}/);
  changeColorTexts.forEach((text: any, idx: number) => {
    const position = idx === 0 ? 1 : idx === 1 ? 3 : 5;
    contentArray.splice(position, 0,
      `<span style='color: ${text.color}'>${text.value}</span>`);
  });
  function patientPage() {
    notification.isValid({
      notifyId: note.id,
      patientId: note.content.patientId,
    })
      .then(() => {
        if (note.status !== 'INVALID') {
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
  /* eslint-disable react/no-danger */
  return (
    <li
      dangerouslySetInnerHTML={{ __html: contentArray.join('') }}
      onClick={!!note.content.organizationId && !! note.content.patientId ? patientPage : () => {}}
    />
  );
  /* eslint-disable react/no-danger */
}

export default ModifyNotification;
