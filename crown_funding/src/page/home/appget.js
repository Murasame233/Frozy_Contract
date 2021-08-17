import Button from '../../compoents/base/button.js';
import Input from "../../compoents/base/input.js";

export default function AppGet() {
  return (
    <div className="flex content-center">
      <div className="flex min-h-full content-center justify-center">
        <span className="inline-block self-center">AppID :</span>
      </div>
      <div className="w-full px-2 md:w-80">
      <Input />
      </div>
      <Button>查询</Button>
    </div>
  );
}
