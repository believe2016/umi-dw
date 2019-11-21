/**
 * Created by wuxiaoran on 2019/1/28.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import BuildTitle from './BuildTitle';

function AntdModalDrag(props) {
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
      maskClosable
    >
      { props.children }
    </Modal>
  );
}

AntdModalDrag.propTypes = {
  title: PropTypes.any,
  extra: PropTypes.string,
  children: PropTypes.node,
};

export default AntdModalDrag;
