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
interface RegisterFormData {
  name: string | null;
  email: string | null;
  password: string | null;
}

class RegisterPage extends Component<PageProps, PageState> {
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
        <h2>Please register!</h2>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
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
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default RegisterPage;
