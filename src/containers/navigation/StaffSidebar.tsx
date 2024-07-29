import {
  faBars,
  faHouse,
  faHouseChimney,
  faMagnifyingGlass,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { motion, useAnimation } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import rdb_logo from '/rdb-logo.png';
import rdb_icon from '/rdb-icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/states/store';
import { toggleSidebar } from '@/states/features/sidebarSlice';

const StaffSidebar = () => {
  // NAVIGATION
  const { pathname } = useLocation();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { isOpen: sidebarOpen } = useSelector(
    (state: RootState) => state.sidebar
  );
  const sidebarNav = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: faHouse,
    },
    {
      title: 'Applications',
      path: '/applications/review',
      icon: faMagnifyingGlass,
    },
    {
      title: 'Foreign Accounts',
      path: '/foreign-applicants',
      icon: faUser,
    },
    {
      title: 'Collaterals',
      path: '/collaterals/review',
      icon: faHouseChimney,
    },
  ].filter(Boolean);

  // ANIMATION
  const controls = useAnimation();
  const controlText = useAnimation();
  const controlTitleText = useAnimation();

  const showMore = useCallback(() => {
    controls.start({
      width: 'auto',
      transition: { duration: 0.2 },
    });
    controlText.start({
      opacity: 1,
      display: 'block',
      transition: { delay: 0.3 },
    });
    controlTitleText.start({
      opacity: 1,
      transition: { delay: 0.3 },
    });
  }, [controls, controlText, controlTitleText]);

  const showLess = useCallback(() => {
    controls.start({
      width: 'auto',
      transition: { duration: 0.2 },
    });

    controlText.start({
      opacity: 0,
      display: 'none',
    });

    controlTitleText.start({
      opacity: 0,
    });
  }, [controls, controlText, controlTitleText]);

  useEffect(() => {
    if (sidebarOpen) {
      showMore();
    } else {
      showLess();
    }
  }, [sidebarOpen, showLess, showMore]);

  return (
    <aside
      className={`flex flex-col h-screen ${
        sidebarOpen ? 'w-[20vw]' : 'w-[5vw]'
      } transition-all duration-300`}
    >
      <motion.div
        animate={controls}
        className={`flex flex-col items-center h-full bg-background text-white transition-all duration-300 px-4`}
      >
        <figure
          className={`w-full flex items-center gap-4 justify-between px-4 py-6 ${
            sidebarOpen ? 'flex-row' : 'flex-col gap-4'
          }`}
        >
          <img
            src={sidebarOpen ? rdb_logo : rdb_icon}
            className={`h-auto ${
              sidebarOpen ? 'w-full max-w-[150px]' : 'max-w-[50px]'
            }`}
            alt="logo"
          />
          <FontAwesomeIcon
            onClick={(e) => {
              e.preventDefault();
              dispatch(toggleSidebar(!sidebarOpen));
            }}
            className="p-2 rounded-full bg-primary px-[9px] text-white text-[16px] cursor-pointer ease-in-out duration-150 hover:scale-[1.01]"
            icon={faBars}
          />
        </figure>
        <menu className="flex flex-col w-full h-full gap-2 mt-6">
          {sidebarNav?.map((nav, index) => {
            const selected = pathname === nav?.path;
            return (
              <Link
                to={nav?.path}
                key={index}
                className={`flex items-center gap-5 px-4 font-semibold text-[15px] ease-in-out duration-200 hover:bg-white text-secondary rounded-md py-3 ${
                  selected && 'bg-white !text-primary'
                } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <FontAwesomeIcon
                  icon={nav?.icon}
                  className={`text-secondary font-bold ${
                    selected && '!text-primary'
                  } ${sidebarOpen ? 'text-[20px]' : 'text-[16px]'}`}
                />
                {sidebarOpen ? nav?.title : null}
              </Link>
            );
          })}
        </menu>
      </motion.div>
    </aside>
  );
};

export default StaffSidebar;
