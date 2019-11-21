import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import SecurityLayout from './SecurityLayout';
// import styles from './index.css';

interface Iroute extends RouteComponentProps{
  children: React.ReactNode
}

const logPages: string[] = ['/login', '/find_pwd'];

const BasicLayout = (props: Iroute) => {
  if (logPages.includes(props.location.pathname)) {
    return props.children;
  }
  return (
    <SecurityLayout>
      { props.children }
    </SecurityLayout>
  );
};

export default BasicLayout;
