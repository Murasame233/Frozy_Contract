import react from "react";
import { getAllApp } from "../../utils/axios";
import Button from "../../compoents/base/button.js"
export default class AppList extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      isloaded: false,
      apps: [],
    };
  }
  state = {
    isloaded: false,
    apps: [],
  };
  componentDidMount = async () => {
    getAllApp().then((v) =>
      this.setState({ ...this.state, isloaded: true, apps: v.data.result })
    );
  };
  render() {
    return (
        <section className="text-gray-600 body-font w-min-full">
          <div className="container px-5 py-4 mx-auto w-full">
            <div className="flex flex-wrap w-full mb-5">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                众筹项目浏览
              </h1>
            </div>
            <div className="flex flex-wrap -m-4 w-full">{this.state.apps.map((app) => {
                  return <div key={app.id} className="xl:w-1/4 md:w-1/2 p-4">
                    <div className="bg-gray-100 p-6 rounded-lg">
                      {/* <Button className="float-right">了解一下</Button> */}
                      <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                        标题
                      </h3>
                      <h2 className="text-lg text-gray-900 font-medium title-font">
                        {app.title}
                      </h2>
                      <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                        内容
                      </h3>
                      <h1 className="text-lg text-gray-900 font-medium title-font mb-2">
                      {app.content}
                      </h1>
                      <p className="leading-relaxed text-base">id:{app.id}</p>
                    </div>
                  </div>;
                })}</div>
          </div>
        </section>
    );
  }
}
