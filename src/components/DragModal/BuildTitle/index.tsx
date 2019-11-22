/**
 * Created by wuxiaoran on 2019/1/28.
 */

import React, { Component } from 'react';
import { Icon } from 'antd';
import DragM from '../DragM';
import './index.scss';

interface buildProps {
  title: any,
  extra?: string,
}

class BuildTitle extends Component<buildProps> {

  modalDom: any = null;

  componentDidMount() {
    // modal的class是ant-modal-wrap
    const modals = document.getElementsByClassName(
      'ant-modal-wrap',
    );
    this.modalDom = modals[modals.length - 1];
  }

  updateTransform = (transformStr: string) => {
    this.modalDom.style.transform = transformStr;
  };

  render() {
    const { title, extra } = this.props;
    return (
      <DragM updateTransform={this.updateTransform}>
        <div className="build-title">
          { !!title ? title
            : <span style={{ visibility: 'hidden' }}>心之力</span> }
          { extra && (
          <span className="extra">
            <Icon type="exclamation-circle" />
            {extra}
          </span>
          )}
        </div>
      </DragM>
    );
  }
}

export default BuildTitle;
