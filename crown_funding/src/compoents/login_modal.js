import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function MyModal(props) {
  let [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];
  const [selected, setSelected] = useState(
    props.accounts ? props.accounts[0].address : null
  );
  const [error, seterror] = useState("");
  const unselect = () => {
    seterror("未选择");
  };
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  登陆
                </Dialog.Title>
                <div className="mt-2">
                  <div className="w-full px-4 py-2">
                    <div className="w-full max-w-md mx-auto">
                      <RadioGroup value={selected} onChange={setSelected}>
                        <RadioGroup.Label>选择账户</RadioGroup.Label>
                        <div className="space-y-2">
                          {props.accounts
                            ? props.accounts.map((a) => (
                                <RadioGroup.Option
                                  key={a.address}
                                  value={a}
                                  className={({ active, checked }) =>
                                    `${
                                      active
                                        ? "ring-2 ring-offset-2 ring-offset-light-blue-300 ring-white ring-opacity-60"
                                        : ""
                                    }
                  ${checked ? "bg-blue-400 text-white" : "bg-white"}
                    relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
                                  }
                                >
                                  {({ active, checked }) => (
                                    <>
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                          <div className="text-sm">
                                            <RadioGroup.Label
                                              as="p"
                                              className={`font-medium w-full overflow-hidden  ${
                                                checked
                                                  ? "text-white"
                                                  : "text-gray-900"
                                              }`}
                                            >
                                              {String(a.address).substring(
                                                0,
                                                16
                                              )}
                                              ...
                                            </RadioGroup.Label>
                                            <RadioGroup.Description
                                              as="span"
                                              className={`inline ${
                                                checked
                                                  ? "text-light-blue-100"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              <span aria-hidden="true">
                                                {/* &middot; */}
                                              </span>{" "}
                                            </RadioGroup.Description>
                                          </div>
                                        </div>
                                        {checked && (
                                          <div className="flex-shrink-0 text-white">
                                            <CheckIcon className="w-6 h-6" />
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </RadioGroup.Option>
                              ))
                            : "您的 ALgoSigner 没有账户"}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                {error && <div>{error}</div>}
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => {
                      selected ? props.login(selected) : unselect();
                    }}
                  >
                    就他了
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
