import { getaccess, giveAway } from "../utils/axios";
import { signandsend } from "../utils/algorand";
import { useState } from "react";
import Button from "../compoents/base/button.js";
import Input from "../compoents/base/input.js";
export default function Buy(props) {
  let [value, setv] = useState("");
  let [sended, setsend] = useState(false);
  let [type, settype] = useState("");
  var handleoptin = () => {
    getaccess(value).then((v) => {
      signandsend(v.data, (e) => {
        setsend(true);
        settype("Opt In");
      });
    });
  };
  var handlegive = () => {
    giveAway(value).then(console.log);
    setsend(true);
    settype("水龙头交易");
  };
  var change = (e) => {
    setv(e.target.value);
  };
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">水龙头</h1>
        </div>
      </header>
      <main>
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 ">
          <div className="px-4 py-6 sm:px-0 flex text-grey-700  items-end justify-center">
            <div className="relative max-w-5xl w-full">
              <label htmlFor="address">地址</label>
              <Input id="address" value={value} onChange={change}></Input>
            </div>
            <div className="mx-1">
              <Button onClick={handleoptin} w="max">
                开启CFD交易(Opt-In)
              </Button>{" "}
            </div>
            <div className="mx-1">
              <Button onClick={handlegive}>接水</Button>
            </div>
            <label>{sended ? "已发送" + type : ""}</label>
          </div>
        </div>
      </main>
    </>
  );
}
