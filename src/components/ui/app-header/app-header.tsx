import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const isConstructor = location.pathname === '/';
  const isFeed = location.pathname === '/feed';
  const isProfile = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link to='/' className={styles.link}>
            <BurgerIcon type={isConstructor ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${
                isConstructor ? '' : 'text_color_inactive'
              }`}
            >
              Конструктор
            </p>
          </Link>
          <Link to='/feed' className={styles.link}>
            <ListIcon type={isFeed ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                isFeed ? '' : 'text_color_inactive'
              }`}
            >
              Лента заказов
            </p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          <Link to='/profile' className={styles.link}>
            <ProfileIcon type={isProfile ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default ml-2 ${
                isProfile ? '' : 'text_color_inactive'
              }`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
