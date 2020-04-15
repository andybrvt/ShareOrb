import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, please log in."
    extra={
      <Button type="primary" href='/'>
        Back To Login
      </Button>
    }
  />
);

export default NoFoundPage;
