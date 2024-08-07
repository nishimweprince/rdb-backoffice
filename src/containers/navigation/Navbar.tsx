import { useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import {
  faChevronDown,
  faChevronUp,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/states/store';
import { FC, useState } from 'react';
import { setUser } from '@/states/features/userSlice';
import rdbLogo from '/rdb-logo.png';

type NavbarProps = {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (['auth/login', 'auth/register'].includes(pathname)) {
    return null;
  }

  // NAV DROPDOWN
  const navDropdown = [
    {
      title: 'Profile',
      link: '/user-profile',
      icon: faUser,
    },
    {
      title: 'Notifications',
      link: '/notifications',
      icon: faBell,
    },
    {
      title: 'Logout',
      link: '/auth/login',
      icon: faRightFromBracket,
    },
  ];

  return (
    <header
      className={`w-full mx-auto px-4 py-3 flex items-center justify-between h-[10vh] fixed top-0 z-[10] bg-background ${className}`}
    >
      <img src={rdbLogo} className={`h-auto max-w-[150px] ml-3`} alt="logo" />
      <nav className="flex items-center gap-4 self-end max-[600px]:gap-3">
        <Link to={'#'} className="px-4 max-[600px]:px-2">
          <menu
            className="flex items-center justify-between gap-2 p-1 px-4 rounded-lg shadow-xs"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            <article>
              <h1 className="text-[15px] font-semibold max-[600px]:text-[14px]">
                {user?.firstName} {user?.lastName || ''}
              </h1>
              <p className="text-[12px] text-gray-500">
                {user?.username?.toLowerCase()}
              </p>
            </article>

            <FontAwesomeIcon
              className="duration-500 ease-in-out"
              icon={isOpen ? faChevronUp : faChevronDown}
            />
          </menu>
        </Link>
      </nav>
      <NavDropdown isOpen={isOpen}>
        <menu className="flex flex-col gap-1 rounded-md">
          {navDropdown.map((nav, index, arr) => {
            return (
              <Link
                to={nav?.link}
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  if (nav?.title === 'Logout') dispatch(setUser({}));
                  navigate(`${nav?.link}`);
                  setIsOpen(false);
                }}
                className={`p-3 text-[14px] hover:bg-primary hover:text-white flex items-center gap-2 ${
                  ['Theme', 'Notifications'].includes(nav?.title)
                    ? 'min-[450px]:hidden'
                    : 'flex'
                } ${index === 0 && 'rounded-t-md'} ${
                  index === arr.length - 1 && 'rounded-b-md'
                }`}
              >
                <FontAwesomeIcon className="text-[14px]" icon={nav?.icon} />
                {nav?.title}
              </Link>
            );
          })}
        </menu>
      </NavDropdown>
    </header>
  );
};

interface NavDropdownProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const NavDropdown: FC<NavDropdownProps> = ({ isOpen, children }) => {
  return (
    <menu
      className={`${
        isOpen ? 'translate-y-0' : 'translate-y-[-400px]'
      } ease-in-out duration-500 z-[10000] absolute top-[12vh] right-[8%] w-[250px] bg-white shadow-md rounded-md max-[450]:w-[100vw]`}
    >
      {children}
    </menu>
  );
};

export default Navbar;
