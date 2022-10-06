import React from 'react';
import './styles.scss';

type TProps = {
  children: React.ReactNode | any;
  size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | string;
  className?: any;
  style?: any;
  prefix?: string;
};

function Header({ children, size = 'h1', prefix, ...props }: TProps) {
  return (
    <div className="heading">
      <div className={`heading__${size}`} {...props}>
        <span className="heading__prefix">{`${prefix ? `${prefix} ` : ''}`}</span>
        {children}
      </div>
    </div>
  );
}

export default Header;
