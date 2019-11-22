/**
 * Created by wuxiaoran on 2017/2/6.
 */
import React, {FormEvent} from 'react';
import {
  Row, Col, Form, Icon, Input,
  Button, message,
} from 'antd';
import { ComponentExt } from '@/utils/reactExt';
import Link from 'umi/link';
import { FormComponentProps } from 'antd/es/form';

import '../login/login.scss'

const FormItem = Form.Item;
let timer: any = null;

interface IFindProps extends FormComponentProps{
}

interface IFindState {
  isGetting: boolean;
  seconds: number;
  isShowPWD: boolean;
  loading: boolean;
  vcode: string;
  phone: string;
}

class FindPWD extends ComponentExt<IFindProps, IFindState> {

  state = {
    isGetting: false,
    seconds: 60,
    isShowPWD: false,
    loading: false,
    vcode: '',
    phone: '',
  };

  componentWillUnmount() {
    clearInterval(timer);
    timer = null;
  }

  togglePWD = () => {
    this.setState({ isShowPWD: !this.state.isShowPWD });
  }

  fetchVcode = () => {
    this.props.form.validateFields(['username'], (err, values) => {
      if (!err) {
        this.setState({ isGetting: true });
        timer = setInterval(() => {
          this.setState({ seconds: this.state.seconds - 1 });
          if (this.state.seconds === 0) {
            clearInterval(timer);
            this.setState({
              isGetting: false,
              seconds: 60,
            });
          }
        }, 1000);
        this.$api.auth.getVCode({ phone: values.username })
          .then((res: IRes) => {
            console.log('res', res);
            const { data, status } = res;
            if (status === 'success') {
              message.success('验证码已发送');
            } else {
              message.error(data.result);
              clearInterval(timer);
              this.setState({
                isGetting: false,
                seconds: 60,
              });
            }
          })
          .catch((xhr: string) => {
            message.error(xhr);
          });
      }
    });
  }

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        this.$api.auth.reset(values)
          .then((res: IRes) => {
            const { status, data } = res;
            if (status === 'success') {
              message.success('修改密码成功');
              this.props.form.resetFields();
            } else {
              message.error(data.result);
            }
            this.setState({ loading: false });
          })
          .catch(() => {
            // message.error('失败');
            this.setState({ loading: false });
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <Row>
          <Col
            md={{ span: 6, offset: 9 }}
            sm={{ span: 12, offset: 6 }}
            xs={{ span: 18, offset: 3 }}
            className="login-content"
          >
            <h1 className="login-logo">找回密码</h1>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{
                    required: true,
                    message: '请输入手机号!',
                  },
                  ],
                  initialValue: this.state.phone,
                })(
                  <Input
                    addonBefore={<Icon type="user" />}
                    placeholder="请输入手机号"
                  />,
                )}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('vcode', {
                      rules: [{ required: true, message: '请输入接收到的验证码!' }],
                      initialValue: this.state.vcode,
                    })(
                      <Input
                        addonBefore={<Icon type="lock" />}
                        size="large"
                        placeholder="请输入收到的验证码"
                      />,
                    )}
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }}>
                    <Button
                      onClick={this.fetchVcode}
                      loading={this.state.isGetting}
                      size="default"
                      type="primary"
                    >
                      {this.state.isGetting ? `${this.state.seconds}s后重新获取` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                {getFieldDecorator('newPassword', {
                  rules: [{ required: true, message: '请输入新密码!' }],
                  initialValue: '',
                })(
                  <Input
                    addonBefore={<Icon type="lock" />}
                    type={this.state.isShowPWD ? 'text' : 'password'}
                    placeholder="新密码"
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
                  <Link to="/login">返回登录</Link>
                </p>
                <Button
                  loading={this.state.loading}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  修改密码
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(FindPWD);
