import React, { Component } from 'react';
import DragModal from '@/components/DragModal';
import MsgHistoryList from './MsgHistoryList';
import './index.scss';

interface mmhProps {
  close: Function,
}
class MultiMsgHistory extends Component<mmhProps> {
  state = {
    title: '群发历史',
  };

  render() {
    const { close } = this.props;
    const { title } = this.state;
    return (
      <DragModal
        className="main__user mmh"
        style={{ top: 50, borderRadius: 10 }}
        width="1000"
        visible={true}
        title={title}
        onCancel={close}
        footer={null}
      >
        <MsgHistoryList />
      </DragModal>
    );
  }
}

export default MultiMsgHistory;
