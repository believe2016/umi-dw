import React, { FormEvent } from 'react';
import { ComponentExt } from '@/utils/reactExt';
import { updateSession } from '@/utils/session';
import {
  Row, Col, Form, Icon, Input, Button, message,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { setAuthorizationToken } from '@/services/http';
import router from 'umi/router';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import './login.scss';

const FormItem = Form.Item;

interface ILoginProps extends FormComponentProps{
  username: string;
  password: string;
  dispatch: Dispatch<AnyAction>;
}

interface ILoginForm {
  username: string;
  password: string;
}

interface ILoginState {
  loading: boolean;
  isShowPWD: boolean;
}

class LoginPage extends ComponentExt<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      loading: false,
      isShowPWD: false,
    };
  }

  componentWillMount() {
    console.log('this', this, this.$api, process.env)
  }

  togglePWD = () => {
    this.setState({ isShowPWD: !this.state.isShowPWD });
  }

  handleLogin= (values: ILoginForm) => {
    const { username, password } = values;
    this.$api.auth.token({
      username,
      password,
      grant_type: 'password',
    })
      .then((res: commonData) => {
        console.log('handleLogin', res);
        setAuthorizationToken(res.access_token);
        updateSession(res);
        this.props.dispatch({
          type: 'auth/changeLoginStatus',
          payload: {
            isLogin: true,
            uid: res.uid
          },
        });
        router.push('/main');
      })
      .catch(err => {
        console.log(err);
        message.error(err.error_description || err.message)
      })
    // this.props.actions.login(values)
    //   .then(() => {
    //     router.push('/');
    //   })
    //   .catch((xhr) => {
    //     if (xhr.response && xhr.response.status / 100 === 4) {
    //       message.error('用户名或密码不正确', 3);
    //     } else {
    //       message.error(xhr.message || '网络请求异常，请稍后再试', 3);
    //     }
    //     this.setState({ loading: false });
    //   });
  }

  handleSubmit = (e: FormEvent) => {
    this.setState({ loading: true });
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.handleLogin(values);
      } else {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <div className="login-slogan">
          <div className="login-slogan__first">您身边的慢病管理专家</div>
          <div className="login-slogan__second">高效 智能 主动 精准</div>
        </div>
        <Row>
          <Col
            md={{ span: 6, offset: 9 }}
            sm={{ span: 12, offset: 6 }}
            xs={{ span: 18, offset: 3 }}
            className="login-content"
          >
            <div className="login-title">账号登录</div>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [
                    { required: true, message: '请输入用户名或手机号!' }],
                  initialValue: '',
                })(
                  <Input
                    placeholder="用户名"
                  />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }],
                  initialValue: '',
                })(
                  <Input
                    type={this.state.isShowPWD ? 'text' : 'password'}
                    placeholder="密码"
                    addonAfter={(
                      <Icon
                        type={this.state.isShowPWD ? 'eye-o' : 'eye'}
                        style={{ cursor: 'pointer' }}
                        onClick={this.togglePWD}
                      />
                    )}
                  />,
                )}
              </FormItem>
              <FormItem>
                <p className="login-form-forgot">
                  <Link to="/find_pwd">忘记密码?</Link>
                </p>
              </FormItem>
              <FormItem>
                <Button
                  loading={this.state.loading}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  登录
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
        <div className="login__version">Version 2.0.2</div>
      </div>
    );
  }
}

export default connect()(Form.create()(LoginPage));
