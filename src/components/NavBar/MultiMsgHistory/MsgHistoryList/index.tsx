import React from 'react';
import { ComponentExt } from '@/utils/reactExt';
import {
  message,
} from 'antd';
import { debounce } from 'lodash';
// @ts-ignore
import { DOCTOR_PATIENT_SIZE } from '@/config';
import MsgItem from '../MsgItem';

let MMH_LISTS: any = null;

interface IProps {
  close: Function,
  userId: string,
  institutionId: string,
}

class MsgHistoryList extends ComponentExt<IProps> {
  state = {
    organizationId: localStorage.getItem('institutionId'),
    doctorId: localStorage.getItem('user'),
    keyword: '',
    patientMessageApiInfos: [],
    isLoadAll: false,
    pagination: {
      pageSize: DOCTOR_PATIENT_SIZE,
      current: 1,
      total: 0,
    },
  };

  componentDidMount() {
    const data: any = this.concatParams();
    data.pageAt = 0;
    this.fetchList(data);
    MMH_LISTS = document.getElementById('MMH_LISTS');
    MMH_LISTS.addEventListener('scroll', this.scrollToLoad, false);
  }

  componentWillUnmount() {
    if (!!MMH_LISTS) {
      MMH_LISTS.removeEventListener('scroll', this.scrollToLoad, false);
      MMH_LISTS = null;
    }
  }

  fetchList = (params: any) => {
    const { doctorId, pagination, isLoadAll } = this.state;
    const { userId } = this.props;
    // console.log('doctorId', doctorId);
    if (!isLoadAll) {
      this.$api.user.getPatientMsg({
        doctorId: !!userId ? userId : doctorId,
        ...params,
      })
        .then((res: any) => {
          console.log(res);
          const { patientMessageApiInfos, total } = res;
          if (patientMessageApiInfos.length === 0) {
            this.setState({
              isLoadAll: true,
            });
          } else {
            this.setState({
              patientMessageApiInfos: this.state
                .patientMessageApiInfos.concat(patientMessageApiInfos),
              pagination: {
                ...pagination,
                total,
                current: params.pageAt + 1,
              },
            });
          }
        })
        .catch(err => message.error(err));
    }
  }

  scrollToLoad = debounce(() => {
    const MMH: any = document.getElementById('MMH_LISTS');
    console.log('MMH', MMH);
    const { scrollTop, offsetHeight, scrollHeight } = MMH;
    console.log('scrollTop, offsetHeight, scrollHeight',
      scrollTop, offsetHeight, scrollHeight);
    const bottomToLoad = 20; // 距离底部多少像素开始加载
    if (scrollTop + offsetHeight + bottomToLoad >= scrollHeight) {
      this.fetchList(this.concatParams());
    }
  }, 300);

  concatParams = () => {
    const data: any = {
      pageSize: DOCTOR_PATIENT_SIZE,
    };
    data.pageAt = this.state.pagination.current;
    return data;
  }

  render() {
    const { patientMessageApiInfos } = this.state;
    const { userId, institutionId } = this.props;

    return (
      <div className="mmh__panel">
        <ul className="history__content" id="MMH_LISTS">
          {
            patientMessageApiInfos.length > 0
              ? patientMessageApiInfos.map(info => (
                <MsgItem key={info.id} info={info} hidePatient={!userId || !!institutionId} />
              ))
              : <p style={{ textAlign: 'center', fontSize: 14 }}>暂无历史数据</p>
          }
        </ul>
      </div>
    );
  }
}

export default MsgHistoryList;
