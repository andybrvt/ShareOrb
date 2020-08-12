import React from 'react';
import { Avatar, Tooltip } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";

const UserAvatar = () => {
  return (
    <Avatar.Group
      maxCount={2}
      maxStyle={{
            color: '#f56a00',
            backgroundColor: '#fde3cf',
          }}
    >
       <Avatar src="https://images.unsplash.com/photo-1542909192-2f2241a99c9d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" />
       <Tooltip title="Andy Le" placement="top">
         <Avatar
           style={{
             backgroundColor: '#f56a00',
           }}
         >
         K
       </Avatar>
        </Tooltip>
       <Tooltip title="Andy Leeeee" placement="top">
         <Avatar
           style={{
             backgroundColor: '#87d068',
           }}
           icon={<UserOutlined />}
         />
       </Tooltip>
       <Avatar
         style={{
           backgroundColor: '#1890ff',
         }}
         icon={<AntDesignOutlined />}
       />
     </Avatar.Group>
  )
}

export default UserAvatar;
