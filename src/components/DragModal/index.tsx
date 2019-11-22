/**
 * Created by wuxiaoran on 2019/1/28.
 */
import React from 'react';
import { Modal } from 'antd';
import BuildTitle from './BuildTitle';

interface dragProps {
  title: any;
  extra?: string;
  children: React.ReactNode;
  className?: string;
  style?: object;
  width?: string | number;
  visible: boolean;
  onCancel: any;
  footer?: React.ReactNode;
  maskClosable?: boolean;
}

function AntdModalDrag(props: dragProps) {
  const title = (
    <BuildTitle
      title={props.title}
      extra={props.extra}
    />
  );
  return (
    <Modal
      style={{ top: 0 }}
      {...props}
      title={title}
      maskClosable={true}
    >
      {props.children}
    </Modal>
  );
}

export default AntdModalDrag;
