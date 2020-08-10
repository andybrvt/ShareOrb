import React from "react";
import { Avatar, Tooltip } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";

const UserAvatar = (_) => {
  return (
    <Avatar.Group>
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          <Avatar
            style={{
              backgroundColor: '#f56a00',
            }}
          >
            K
          </Avatar>
          <Tooltip title="Ant User" placement="top">
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
  );
};

export default UserAvatar;
