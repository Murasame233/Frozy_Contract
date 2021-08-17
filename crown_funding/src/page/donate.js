import Button from "../compoents/base/button";
import Input from "../compoents/base/input";
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { algoDetect, donateApp, getApp, handleapps } from "../utils/algorand";
import { timestampToTime } from "../compoents/table";

export default function Donates(props) {
  var [modal, setmodal] = useState(false);
  var [id, setid] = useState(null);
  var [input, setinput] = useState("");
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">捐赠</h1>
        </div>
      </header>
      <main>
        <DonateModal id={id} open={modal} setOpen={setmodal} address={props.address}/>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex content-center content-center justify-center">
            <div className="flex min-h-full content-center justify-center">
              <span className="inline-block self-center">AppID :</span>
            </div>
            <div className="w-full px-2 md:w-80">
              <Input
                value={input}
                type="number"
                onChange={(e) => setinput(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setid(Number(input));
                setmodal(true);
              }}
            >
              查询
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

export class DonateModal extends React.Component {
  state = {
    app: null,
    message: "加载中",
  };
  focusRef = React.createRef();
  componentDidUpdate(prevp, prevs) {
    if (prevs != this.state) {
      if (this.state.app == null || this.state.message == null) {
        return;
      } else {
      }
    } else if (
      prevp.id != this.props.id ||
      (this.props.id && !this.state.app)
    ) {
      if (this.props.id) {
        // algoDetect().then(() => {
        getApp(this.props.id)
          .then((v) => {
            console.log(v)
            handleapps([v]).then((v) => {
              this.setState({ ...this.state, app: v[0], message: null });
            });
          })
          .catch((e) => {
            this.setState({
              ...this.state,
              app: null,
              message: "App 不存在",
            });
          });
        // });
      }
    }
  }
  close = () => {
    this.props.setOpen(false);
  };
  componentWillUnmount = () => {
    this.setState({
      ...this.state,
      app: null,
      message: "加载中",
    });
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
                        捐赠
                      </Dialog.Title>
                      <div className="mt-2">
                        {this.state.message ? (
                          this.state.message
                        ) : (
                          <>
                            id: {this.state.app.id}
                            <p className="text-sm text-gray-500">
                              托管账户: {this.state.app.Escrow.substring(0, 12)}
                              ...
                            </p>
                            <p>
                              创建日期:{" "}
                              {timestampToTime(this.state.app.StartDate)}
                            </p>
                            <p>
                              结束日期:{" "}
                              {timestampToTime(this.state.app.EndDate)}
                            </p>
                            <p>
                              已筹/目标: {this.state.app.Total}/
                              {this.state.app.Goal}
                            </p>
                            <Donateinput address={this.props.address} app={this.state.app}/>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => this.close()}
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

function Donateinput(props) {
  var [amount,setamount] =  useState("");
  return (
    <div className="mt-2 flex items-end">
      <div className="mr-2">
        <label>金额</label>
        <Input type="number" value={amount} onChange={(v)=>setamount(v.target.value)}></Input>
      </div>
      <Button onClick={()=>donateApp(props.address,props.app,Number(amount))}>捐赠</Button>
    </div>
  );
}
