import {
  faBars,
  faHouse,
  faUser,
  faChevronDown,
  faChevronUp,
  faUserTie,
  faPenToSquare,
  faGear,
  faChartLine,
  faHouseChimney,
  faFileLines
} from "@fortawesome/free-solid-svg-icons"
import { faCreativeCommonsNd } from "@fortawesome/free-brands-svg-icons"
import { motion, useAnimation } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/states/store"
import { toggleSidebar } from "@/states/features/sidebarSlice"

const StaffSidebar = () => {
  const { pathname } = useLocation()
  const dispatch: AppDispatch = useDispatch()
  const { isOpen: sidebarOpen } = useSelector(
    (state: RootState) => state.sidebar
  )
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false) // New state for Settings

  const sidebarNav = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: faHouse
    },
    {
      title: "Applications",
      path: "#",
      icon: faFileLines,
      subcategories: [
        {
          title: "Business Applications",
          path: "/applications/business",
          icon: faUserTie
        },
        {
          title: "Business Amendments",
          path: "/applications/business/amendments",
          icon: faPenToSquare
        },
        {
          title: "Collateral Applications",
          path: "/collaterals/review",
          icon: faHouseChimney
        },
        {
          title: "Name reservations",
          path: "/applications/name-reservations",
          icon: faCreativeCommonsNd
        },
        {
          title: "Foreign Accounts",
          path: "/foreign-applicants",
          icon: faUser
        }
      ]
    },
    {
      title: "Settings",
      path: "#",
      icon: faGear,
      subcategories: [
        {
          title: "Registrar General",
          path: "/settings/registrar-general",
          icon: faUserTie
        },
        {
          title: "Control Panel",
          path: "/settings/control-panel",
          icon: faPenToSquare
        }
      ]
    },
    {
      title: "Business activities",
      path: "/settings/business-activities",
      icon: faChartLine
    }
  ]

  const controls = useAnimation()
  const controlText = useAnimation()
  const controlTitleText = useAnimation()

  const showMore = useCallback(() => {
    controls.start({
      width: "auto",
      transition: { duration: 0.2 }
    })
    controlText.start({
      opacity: 1,
      display: "block",
      transition: { delay: 0.3 }
    })
    controlTitleText.start({
      opacity: 1,
      transition: { delay: 0.3 }
    })
  }, [controls, controlText, controlTitleText])

  const showLess = useCallback(() => {
    controls.start({
      width: "auto",
      transition: { duration: 0.2 }
    })

    controlText.start({
      opacity: 0,
      display: "none"
    })

    controlTitleText.start({
      opacity: 0
    })
  }, [controls, controlText, controlTitleText])

  useEffect(() => {
    if (sidebarOpen) {
      showMore()
    } else {
      showLess()
    }
  }, [sidebarOpen, showLess, showMore])

  return (
    <nav
      className={`flex flex-col h-screen ${
        sidebarOpen ? "w-[22vw]" : "w-[6vw]"
      } transition-all duration-300 fixed top-[10vh]`}
    >
      <motion.div
        animate={controls}
        className={`flex flex-col items-center h-full bg-background text-white transition-all duration-300 px-4`}
      >
        <header
          className={`w-full flex items-center gap-4 justify-end px-4 py-4 ${
            sidebarOpen ? "flex-row" : "flex-col gap-4"
          }`}
        >
          <FontAwesomeIcon
            onClick={(e) => {
              e.preventDefault()
              dispatch(toggleSidebar(!sidebarOpen))
            }}
            className="p-2 rounded-full bg-primary px-[9px] text-white text-[16px] cursor-pointer ease-in-out duration-150 hover:scale-[1.01]"
            icon={faBars}
          />
        </header>
        <ul className="flex flex-col w-full h-full gap-2">
          {sidebarNav?.map((nav, index) => {
            const selected = pathname === nav?.path
            return (
              <li key={index}>
                <Link
                  to={nav?.path}
                  className={`flex items-center gap-5 px-4 font-semibold text-[15px] ease-in-out duration-200 hover:bg-white text-secondary rounded-md py-3 ${
                    selected && "bg-white !text-primary"
                  } ${sidebarOpen ? "justify-start" : "justify-center"}`}
                  onClick={(e) => {
                    if (nav.subcategories) {
                      e.preventDefault()
                      if (nav.title === "Applications") {
                        setIsApplicationsOpen(!isApplicationsOpen)
                      } else if (nav.title === "Settings") {
                        setIsSettingsOpen(!isSettingsOpen)
                      }
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={nav?.icon}
                    className={`text-secondary font-bold ${
                      selected && "!text-primary"
                    } ${sidebarOpen ? "text-[20px]" : "text-[16px]"}`}
                  />
                  {sidebarOpen ? nav?.title : null}
                  {nav.subcategories && sidebarOpen && (
                    <FontAwesomeIcon
                      icon={
                        nav.title === "Applications"
                          ? isApplicationsOpen
                            ? faChevronUp
                            : faChevronDown
                          : isSettingsOpen
                          ? faChevronUp
                          : faChevronDown
                      }
                      className="ml-auto"
                    />
                  )}
                </Link>
                {nav.subcategories && sidebarOpen && (
                  <ul className="px-2">
                    {(nav.title === "Applications" && isApplicationsOpen) ||
                    (nav.title === "Settings" && isSettingsOpen)
                      ? nav.subcategories.map((sub, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={sub.path}
                              className={`flex items-center gap-5 px-4 font-semibold text-[15px] ease-in-out duration-200 hover:bg-white text-secondary rounded-md py-3 ${
                                pathname === sub.path &&
                                "bg-white !text-primary"
                              } ${
                                sidebarOpen ? "justify-start" : "justify-center"
                              }`}
                            >
                              <FontAwesomeIcon
                                icon={sub.icon}
                                className={`text-secondary font-bold ${
                                  pathname === sub.path && "!text-primary"
                                } ${
                                  sidebarOpen ? "text-[20px]" : "text-[16px]"
                                }`}
                              />
                              {sidebarOpen ? sub.title : null}
                            </Link>
                          </li>
                        ))
                      : null}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </motion.div>
    </nav>
  )
}

export default StaffSidebar
