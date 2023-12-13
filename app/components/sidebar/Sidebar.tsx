import { Disclosure, Transition } from "@headlessui/react";
import { NavLink } from "@remix-run/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoAnalytics, IoSettingsOutline } from "react-icons/io5";
import {
  RxDashboard,
  RxCodesandboxLogo,
  RxBackpack,
  RxAvatar,
  RxChevronDown,
} from "react-icons/rx";

interface SideBarItem {
  id: number;
  title: string;
  slug: string;
  icon: JSX.Element;
}

interface SideBarMenu extends SideBarItem {
  subMenu: SideBarItem[];
}

interface SideBarData {
  menu: SideBarMenu[];
}

// const sideBarData: SideBarData = {
//   menu: [
//     {
//       id: 1,
//       title: "Dashboard",
//       slug: "",
//       icon: <TfiDashboard />,
//       subMenu: [],
//     },
//     {
//       id: 2,
//       title: "Accounts",
//       slug: "accounts",
//       icon: <FaFileInvoiceDollar />,
//       subMenu: [
//         {
//           id: 1,
//           title: "Orders",
//           slug: "orders",
//           icon: <TbFileInvoice />,
//         },
//         {
//           id: 2,
//           title: "Invoices",
//           slug: "invoices",
//           icon: <LiaFileInvoiceSolid />,
//         },
//         {
//           id: 3,
//           title: "Statements",
//           slug: "statements",
//           icon: <FaFileInvoice />,
//         },
//       ],
//     },
//     {
//       id: 3,
//       title: "Products",
//       slug: "products",
//       icon: <RiDropboxLine />,
//       subMenu: [],
//     },
//     {
//       id: 4,
//       title: "Notifications",
//       slug: "notifications",
//       icon: <IoIosNotifications />,
//       subMenu: [],
//     },
//     {
//       id: 5,
//       title: "Content Management",
//       slug: "content-management",
//       icon: <MdOutlineContentPaste />,
//       subMenu: [
//         {
//           id: 1,
//           title: "Promotions",
//           slug: "promotions",
//           icon: <MdContentPasteGo />,
//         },
//       ],
//     },
//     {
//       id: 6,
//       title: "My Team",
//       slug: "my-team",
//       icon: <IoPerson />,
//       subMenu: [],
//     },
//     {
//       id: 7,
//       title: "Support Session",
//       slug: "support-session",
//       icon: <FaRegCircleQuestion />,
//       subMenu: [],
//     },
//     {
//       id: 8,
//       title: "Certificate Generator",
//       slug: "certificate-generator",
//       icon: <PiCertificate />,
//       subMenu: [],
//     },
//     {
//       id: 9,
//       title: "Company Settings",
//       slug: "company-settings",
//       icon: <CiSettings />,
//       subMenu: [],
//     },
//     {
//       id: 10,
//       title: "Warranty",
//       slug: "warranty",
//       icon: <SiFluxus />,
//       subMenu: [],
//     },
//   ],
// };

export const sideBarData: SideBarData = {
  menu: [
    {
      id: 1,
      title: "Dashboard",
      slug: "",
      icon: <RxDashboard />,
      subMenu: [],
    },
    {
      id: 2,
      title: "Products",
      slug: "products",
      icon: <RxCodesandboxLogo />,
      subMenu: [],
    },
    {
      id: 3,
      title: "Customers",
      slug: "customers",
      icon: <RxAvatar />,
      subMenu: [],
    },
    {
      id: 4,
      title: "Orders",
      slug: "orders",
      icon: <AiOutlineShoppingCart />,
      subMenu: [],
    },
    {
      id: 5,
      title: "Categories",
      slug: "categories",
      icon: <RxBackpack />,
      subMenu: [
        // {
        //   id: 1,
        //   title: "Sub-Category",
        //   slug: "sub-category",
        //   icon: <></>,
        // },
      ],
    },
    {
      id: 6,
      title: "Analytics",
      slug: "analytics",
      icon: <IoAnalytics />,
      subMenu: [],
    },

    {
      id: 7,
      title: "Settings",
      slug: "settings",
      icon: <IoSettingsOutline />,
      subMenu: [],
    },
  ],
};
export function SideBar() {
  return (
    <nav>
      <ul>
        {sideBarData.menu.length > 0 &&
          sideBarData.menu.map((menuItem, index) => (
            <li key={menuItem.id}>
              {menuItem?.subMenu.length > 0 ? (
                <>
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="w-full">
                          <div className="nav__disclosure">
                            <div className="flex space-x-4 items-center font-bold text-base">
                              {menuItem.icon}
                              <h4 className="">{menuItem.title}</h4>
                            </div>
                            <RxChevronDown
                              className={`${
                                open ? "rotate-180" : ""
                              } transform duration-300`}
                            />
                          </div>
                        </Disclosure.Button>
                        <Transition
                          enter="transition-opacity ease-linear duration-75"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="transition-opacity  ease-linear duration-150"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Disclosure.Panel>
                            {menuItem.subMenu.length > 0 ? (
                              <ul className="block space-y-1">
                                {menuItem.subMenu.map((subItem, index) => (
                                  <li key={index} className="">
                                    <NavLink
                                      to={`/${menuItem.slug}/${subItem.slug}`}
                                      className={({ isActive, isPending }) =>
                                        isActive
                                          ? "nav__item nav__item--active !pl-8"
                                          : isPending
                                          ? "nav__item nav__item--active !pl-8 "
                                          : "nav__item !pl-8 !text-gray-500"
                                      }
                                    >
                                      <figure>{subItem.icon}</figure>
                                      <h4>{subItem.title}</h4>
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              ""
                            )}
                          </Disclosure.Panel>
                        </Transition>
                      </>
                    )}
                  </Disclosure>
                </>
              ) : (
                <NavLink
                  to={`/${menuItem.slug}`}
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "nav__item nav__item--active"
                      : isPending
                      ? "nav__item nav__item--active"
                      : "nav__item"
                  }
                >
                  <figure>{menuItem.icon}</figure>
                  <h4 className="truncate">{menuItem.title}</h4>
                </NavLink>
              )}
            </li>
          ))}
      </ul>
    </nav>
  );
}
