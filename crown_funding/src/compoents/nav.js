import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Link, useLocation } from "react-router-dom";
const navigation = [
  { name: "主页", to: "/" },
  { name: "创建", to: "/create" },
  { name: "水龙头", to: "/buy" },
  { name: "我的", to: "/my", login: true },
  { name: "捐赠", to: "/donate", login: true },
];

var loginjudge = (item, islogin) => {
  if (item.login && islogin) {
    return true;
  }
  if (!item.login) return true;
  return false;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar(props) {
  var p = useLocation();
  var i = navigation.findIndex((e) => e.to === p.pathname);
  var profile = [
    {
      name: "Sign out",
      callback: () => {
        props.logout && props.logout();
      },
    },
  ];
  var [now, setnow] = useState(i);
  var index = 1;
  var tabindex = () => {
    index++;
    return index - 1;
  };
  return (
    <div>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0"></div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item, itemIdx) => {
                        if (loginjudge(item,props.islogin)) {
                          return itemIdx === now ? (
                            <Fragment key={item.name}>
                              <Link
                                to={item.to}
                                className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                              >
                                {item.name}
                              </Link>
                            </Fragment>
                          ) : (
                            <Link
                              tabIndex={tabindex()}
                              onClick={() => setnow(itemIdx)}
                              key={item.name}
                              to={item.to}
                              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              {item.name}
                            </Link>
                          );
                        }else {
                          return <></>;
                        }
                        
                      })}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      {!props.islogin ? (
                        <div
                          onClick={() => {
                            if (props.openModal) {
                              props.openModal(true);
                            }
                          }}
                        >
                          <Fragment>
                            <div className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer px-3 py-2 rounded-md text-sm font-medium">
                              <span className="sr-only">Open user menu</span>
                              Log in
                            </div>
                          </Fragment>
                        </div>
                      ) : (
                        ({ open }) => (
                          <>
                            <div>
                              <Menu.Button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                <span className="sr-only">Open user menu</span>
                                {props.assets} CFD
                              </Menu.Button>
                            </div>
                            <Transition
                              show={open}
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items
                                static
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                              >
                                {profile.map((item) => (
                                  <Menu.Item
                                    key={item.name}
                                    onClick={item.callback}
                                  >
                                    {({ active }) => (
                                      <div
                                        className={classNames(
                                          active ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700"
                                        )}
                                      >
                                        {item.name}
                                      </div>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </>
                        )
                      )}
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
