import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { Dispatch, AnyAction } from 'redux';
import { ConnectState, ConnectProps } from '@/models/connect';
import PageLoading from '@/components/PageLoading';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  user: Iuser;
  uid: string;
  dispatch: Dispatch<AnyAction>
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: !!localStorage.getItem('access_token'),
  };

  componentDidMount() {
    // const { isReady } = this.state;
    // if (!isReady) {
    this.getCurrentUser();
    // }
  }

  getCurrentUser = () => {
    this.setState({
      isReady: true,
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
    // const { isReady } = this.state;
    const { children, user, uid } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = user && user.tel;
    const queryString = stringify({
      redirect: window.location.href,
    });
    // 没有登录但有uid => 刷新
    if (!isLogin && !!uid) {
      return <PageLoading />;
    }
    // 没有登录
    if (!isLogin) {
      return <Redirect to={`/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user, auth }: ConnectState) => ({
  user: user.user,
  uid: auth.uid,
}))(SecurityLayout);
