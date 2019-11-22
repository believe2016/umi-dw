import React from 'react';
import logo from '@/assets/img/logo_white.png';
import Link from 'umi/link';
import { isOpenedSub } from '@/utils/utils';
import { setHeader } from '@/services/http';

interface logoProps {
  curHospital: {
    id: string;
    name: string;
  },
  role: string,
  institutionId: string,
}

function Logo(props: logoProps) {
  const { role, institutionId, curHospital } = props;
  let child = <img src={logo} alt="" />;
  const resetHeader = () => {
    localStorage.setItem('doctorRoleSider', 'INDEPENDENT');
    setHeader({
      oId: '',
      uId: localStorage.getItem('user'),
      pId: null,
      role: 'DOCTOR',
    });
    window.localStorage.setItem('role', 'DOCTOR');
  };
  if (!isOpenedSub(curHospital.id)) {
    switch (role) {
      case 'DOCTOR':
      case 'ASSISTANT':
      case 'ADVISER':
        child = (
          <Link
            to="/doctor/tree/independent"
            onClick={() => resetHeader()}
            className="logo-wrap"
          >
            <img src={logo} alt="" />
          </Link>
        );
        break;
      case 'ADMIN':
      case 'SUB_ROOT':
        child = (
          <Link to={`/institution/index?id=${institutionId}`}>
            <img src={logo} alt="" />
          </Link>
        );
        break;
      case 'ROOT':
        child = (
          <Link to="/institution/root">
            <img src={logo} alt="" />
          </Link>
        );
        break;
      default:
        break;
    }
  }
  return child;
}

export default Logo;
