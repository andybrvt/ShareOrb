import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage = () => (



  <div>
      <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary" href="./">Back Home</Button>}
    />,
    </div>
);

export default NoFoundPage;
