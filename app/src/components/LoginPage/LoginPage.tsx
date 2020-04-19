import { Component } from "react";
import { Form, Input, Button } from "antd";
import React from "react";
import { AppUser } from "../../App";

interface PageState {
  hasError: boolean;
  error: string | null;
}

interface PageProps {
  loginAppUser: (user: AppUser) => void;
}

class LoginPage extends Component<PageProps, PageState> {
  public state: Readonly<PageState> = {
    hasError: false,
    error: null,
  };

  public render() {
    const onFinish = (data: any) => {
      const { loginAppUser } = this.props;

      if (data.email && data.password) {
        console.log("Success:", data);
        loginAppUser({ email: data.email, password: data.password });
      }
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };

    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
    const tailLayout = {
      wrapperCol: { offset: 4, span: 8 },
    };

    return (
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h2>Please login</h2>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginPage;
