import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import SecurityLayout from './SecurityLayout';
import './index.css';

interface Iroute extends RouteComponentProps{
  children: React.ReactElement
}

const logPages: string[] = ['/login', '/find_pwd'];

const BasicLayout = (props: Iroute) => {
  if (logPages.includes(props.location.pathname)) {
    return props.children;
  }
  return (
    <SecurityLayout>
      {props.children}
    </SecurityLayout>
  );
};

export default BasicLayout;
