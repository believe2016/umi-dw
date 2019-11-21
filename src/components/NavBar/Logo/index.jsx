import React from 'react';
import logo from 'assets/img/logo_white.png';
import { Link } from 'react-router';
import { isOpenedSub } from 'utils/tools';
import { PropTypes } from 'prop-types';
import { setHeader } from 'utils/api';
import { Base64 } from 'js-base64';

function Logo(props) {
  const { role, institutionId, hospitalIndex } = props;
  let child = <img src={logo} alt="" />;
  const resetHeader = () => {
    localStorage.setItem('doctorRoleSider', 'INDEPENDENT');
    const headerObj = JSON.stringify({
      oId: '',
      uId: localStorage.getItem('user'),
      pId: null,
      role: 'DOCTOR',
    });
    const ref = Base64.encode(headerObj);
    setHeader(ref);
    window.localStorage.setItem('role', 'DOCTOR');
  };
  if (!isOpenedSub(hospitalIndex.id)) {
    switch (role) {
      case 'DOCTOR':
      case 'ASSISTANT':
      case 'ADVISER':
        child = (
          <Link
            to="/doctor/index/independent"
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
  return (
    <React.Fragment>
      { child }
    </React.Fragment>
  );
}
Logo.propTypes = {
  hospitalIndex: PropTypes.object,
  role: PropTypes.string,
  institutionId: PropTypes.string,
};
export default Logo;
