import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import cn from 'classnames';

interface UserAvatarProps {
  /** default 50 */
  size?: number;
  src?: string;
  className?: string;
  style?: React.CSSProperties;
}

function UserAvatar({ size = 40, className, ...rest }: UserAvatarProps) {
  return (
    <Avatar
      icon={<UserOutlined />}
      {...rest}
      size={size}
      className={cn('cl-user-avatar rounded-full', className)}
      src={rest.src || undefined}
    />
  );
}

export { UserAvatar };
