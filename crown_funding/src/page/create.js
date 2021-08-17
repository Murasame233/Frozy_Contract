import { useState } from "react";
import { CreateApp } from "../utils/algorand";
import Button from "../compoents/base/button.js";
import Input from "../compoents/base/input.js";

export default function Create(props) {
  let [day, setday] = useState(604800*1000);
  let [amount, setamount] = useState(0);
  let [disable, setdisable] = useState(false);
  let [isCreating, setisCreating] = useState(false);
  let [isCreated, setisCreated] = useState("");
  let handlecreate = () => {
    setdisable(true);
    setisCreating(true);
    setisCreated("");
    var finish = ()=>{
      setdisable(false);
      setisCreating(false);
    }
    CreateApp(props.account, day, amount,finish).then((n) => {
      setisCreated(n);
    });
  };
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">创建</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl py-6 sm:px-3 lg:px-4 flex justify-center">
          <form className="space-y-4 text-gray-700 flex flex-wrap max-w-xl w-full items-center justify-center">
            <div className="w-full flex -mx-2 space-y-4 md:space-y-0 items-end">
              <div className="w-full px-2">
                <label className="block mb-1" htmlFor="formGridCode_name">
                  总额
                </label>
                <Input
                  onChange={(e) => {
                    if (Number(e.target.value) == e.target.value) {
                      setamount(e.target.value);
                    }
                  }}
                  value={amount}
                  maxLength={8}
                  disabled={!props.account || disable}
                />
              </div>
              <div className="w-full px-2">
                <label className="block mb-1" htmlFor="formGridCode_last">
                  持续时间
                </label>
                <div className="relative inline-block w-full text-gray-700">
                  <select
                    onChange={(e) => setday(e.target.value)}
                    className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
                    placeholder="Regular input"
                    value={day}
                    disabled={!props.account || disable}
                  >
                    <option value={604800*1000}>7天</option>
                    <option value={1209600*1000}>14天</option>
                    <option value={2592000*1000}>30天</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="px-2">
                <Button
                  disabled={!props.account || disable}
                  onClick={handlecreate}
                >
                  创建
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center flex-col">
              <div className="text-pink-400">
                {isCreating && "请等待完成交易"}
              </div>
              <div className="text-pink-400">
                {isCreated && "AppID为:" + isCreated + ", 去跟别人分享吧"}
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
