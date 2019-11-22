/**
 * title: 用户列表
 */
import React from 'react';
import router from 'umi/router';
import styles from './index.scss';

export default function() {
  return (
    <div className={styles.normal}>
      <h1>Page users</h1>
      <button onClick={router.goBack}>go back</button>
    </div>
  );
}
