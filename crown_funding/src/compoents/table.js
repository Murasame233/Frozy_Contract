import Button from "../compoents/base/button";

export function timestampToTime(timestamp) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = date.getDate() + " ";
  var h = ("0" + date.getHours()).substr(-2) + ":";
  var m = ("0" + date.getMinutes()).substr(-2) + ":";
  var s = ("0" + date.getSeconds()).substr(-2);
  return Y + M + D + h + m + s;
}
export default function Tables(props) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    App信息
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    剩余/目标
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    状态
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {props.apps &&
                  props.apps.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="">
                            <div className="text-sm font-medium text-gray-900">
                              ID:{app.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              过期时间：{timestampToTime(app.EndDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={
                            (app.Total > app.Goal
                              ? "text-red-400"
                              : "text-green-400") + " text-sm"
                          }
                        >
                          {app.Total}
                        </span>
                        /
                        <span className="text-sm text-gray-900">
                          {app.Goal}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.Escrow ? (
                          app.EndDate > Date.now() ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              有效
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              已过期
                            </span>
                          )
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            此app异常请删除
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <Button
                          onClick={() => {
                            props.EditApp && props.EditApp(app.id);
                          }}
                        >
                          编辑文案
                        </Button>{" "}
                        <Button
                          disabled={app.Total < app.Goal}
                          onClick={() => {
                            props.ClaimApp && props.ClaimApp(app);
                          }}
                        >
                          提币
                        </Button>
                        <Button
                          onClick={() => {
                            props.DeleteApp && props.DeleteApp(app.id);
                          }}
                        >
                          删除
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
