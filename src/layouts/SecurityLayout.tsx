import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { Dispatch, AnyAction } from 'redux';
import { ConnectState, ConnectProps } from '@/models/connect';
import NavBar from '@/components/NavBar';
import PageLoading from '@/components/PageLoading';
import { localRole } from '@/utils/consts';

interface SecurityLayoutProps extends ConnectProps{
  children: React.ReactElement;
  user: Iuser;
  uid: string;
  isLogin: boolean;
  relationship: Iorg[];
  legalRelationship: Iorg[];
  institution: Iins;
  dispatch: Dispatch<AnyAction>
}

interface SecurityLayoutState {
  isLogin: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    const { isLogin } = nextProps;
    if (isLogin !== prevState.isLogin) {
      return { isLogin }
    }
    return null;
  }

  state: SecurityLayoutState = {
    isLogin: !!localStorage.getItem('access_token'),
  };

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser = () => {
    this.setState({
      isLogin: true,
    });
    const { dispatch, uid } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
        payload: uid
      });
    }
  }

  render() {
    const { children, user, uid, relationship, location, match, institution, legalRelationship } = this.props;
    const { isLogin } = this.state;
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const queryString = stringify({
      redirect: window.location.href,
    });
    // 没有登录
    if (!isLogin) {
      return <Redirect to={`/login?${queryString}`} />;
    }
    if (!!isLogin && !!uid && !!user.tel) {
      let role = '';
      let roles = user.roles;
      if (!!localRole) {
        role = localRole;
      } else {
        role = user.roles.includes('DOCTOR') ? 'DOCTOR' : legalRelationship[0].roles[0];
        // 包含护士角色则需要与user里的全部角色合并去重，再判断是否是护士科室管理员
        if (legalRelationship[0].roles.includes('OPERATOR')) {
          roles = Array.from(new Set([...legalRelationship[0].roles, ...user.roles]));
          role = roles.includes('OPERATOR_DEPARTMENT_ADMIN') ? 'OPERATOR_DEPARTMENT_ADMIN' : 'OPERATOR';
        }
        localStorage.setItem('role', role);
      }
      return (
        <>
          { user.status === 'NORMAL' ? (
            <NavBar
              uid={uid}
              role={role}
              roles={roles}
              match={match}
              location={location}
              institutionId={institution.id}
              relationship={relationship}
              organizationInfo={relationship[0]}
              // fetchUserInfo={this.fetchUserInfo}
            />
          ) : null }
          {children}
        </>
      );
    }
    return <PageLoading />;
  }
}

export default connect(({ user, auth }: ConnectState) => ({
  user: user.user,
  relationship: user.relationship,
  legalRelationship: user.legalRelationship,
  institution: user.institution,
  uid: auth.uid,
  isLogin: auth.isLogin,
}))(SecurityLayout);
