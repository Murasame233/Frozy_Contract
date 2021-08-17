import React from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState } from "react";
import Input from "./base/input";
import { getaApp ,updateAppcontent} from "../utils/axios";
export class EditModal extends React.Component {
  focusRef = React.createRef();
  close = () => {
    this.props.close();
  };
  state = {
    show: false,
    title: "",
    content: "",
  };
  updateApp=()=>{
    updateAppcontent({...this.state,id:this.props.id}).then(
      console.log
    )
  }
  componentDidUpdate = (prevprops) => {
    if (prevprops != this.props) {
      this.props.id &&
        getaApp(this.props.id).then((v) => {
          console.log(v)
          var title = "";
          var content = "";
          var show = false;
          if (v.data.result.title) {
            console.log(v.data.result.title);
            title = v.data.result.title;
          }
          if (v.data.result.content) {
            content = v.data.result.content;
          }
          if (v.data.result.content) {
            show = v.data.result.show;
          }
          this.setState({
            ...this.state,
            title,
            content,
            show,
          });
        });
    }
  };
  render() {
    return (
      <Transition.Root show={this.props.open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={this.focusRef}
          open={this.props.open}
          onClose={() => this.close()}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        编辑
                      </Dialog.Title>
                      <div className="mt-2">
                        <div>
                          <label>标题</label>
                          <Input
                          maxLength="20"
                          value={this.state.title}
                            onChange={(v) => {
                              this.setState({
                                ...this.state,
                                title: v.target.value,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <label>详情</label>
                          <div>
                            <textarea
                            maxLength="50"
                            value={this.state.content}
                              onChange={(v) => {
                                this.setState({
                                  ...this.state,
                                  content: v.target.value,
                                });
                              }}
                              className="border  rounded-lg  resize-none text-grey-darkest flex-1 w-full p-1 bg-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label>是否展示</label>
                          <div className="py-1">
                            <Switch
                              checked={this.state.show}
                              onChange={(v) =>
                                this.setState({ ...this.state, show: v })
                              }
                              className={`${
                                this.state.show ? "bg-blue-900" : "bg-blue-700"
                              }
          relative inline-flex flex-shrink-0 h-6 w-11 items-center border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span
                                aria-hidden="true"
                                className={`${
                                  this.state.show
                                    ? "translate-x-5"
                                    : "translate-x-1"
                                }
            pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                              />
                            </Switch>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      this.updateApp()
                      this.close();
                    }}
                    ref={this.focusRef}
                  >
                    确定
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }
}
