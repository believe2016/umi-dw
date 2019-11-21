import React, { Component } from 'react';
import { func } from 'prop-types';
import DragModal from 'components/DragModal';
import MsgHistoryList from './MsgHistoryList';
import './index.scss';

class MultiMsgHistory extends Component {
  static defaultProps = {
  };

  static propTypes = {
    close: func,
  };

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
        visible
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
