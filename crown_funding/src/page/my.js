import react from "react";
import Tables from "../compoents/table";
import Confirm from "../compoents/confirm";
import { getaccount, handleapps, DeleteApp, claimApp } from "../utils/algorand";
import { EditModal } from "../compoents/edit_modal";

export default class My extends react.Component {
  constructor(props) {
    super(props);
    this.setState({
      address: null,
      apps: null,
      openmodal: false,
      openeditmodal: false,
    });
  }
  state = {
    address: null,
    apps: null,
    openmodal: false,
    openeditmodal: false,
  };
  setopen = (v) => {
    this.setState({ ...this.state, openmodal: v });
  };
  componentDidMount = () => {
    var address = null;
    if (this.props.address) {
      address = this.props.address;
    }
    this.setState({ ...this.state, address });
    this.props.address &&
      getaccount(this.props.address).then((re) => {
        handleapps(re["created-apps"]).then((apps) =>
          this.setState({ ...this.state, apps })
        );
      });
  };
  delapp = (id) => {
    DeleteApp(this.state.address, id).then((v) => {
      console.log(v);
      var apps = this.state.apps.filter((v) => {
        return v.id !== id;
      });
      this.setState({
        ...this.state,
        apps,
      });
    });
  };
  confirm = (id) => {
    this.id = id;
    this.setopen(true);
  };
  id = null;
  claim_app = (app) => {
    claimApp(this.state.address, app).then((v) => {
      console.log(v);
    });
  };
  openeditmodal = (id) => {
    this.id = id;
    this.setState({ ...this.state, openeditmodal: true });
  };
  closeeditmodal = () => {
    this.id = null;
    this.setState({ ...this.state, openeditmodal: false });
  };
  render() {
    return (
      <>
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">我的</h1>
          </div>
        </header>
        <main>
        <EditModal id={this.id} open={this.state.openeditmodal} close={()=>this.closeeditmodal()}/>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Tables
              apps={this.state.apps}
              EditApp={this.openeditmodal}
              DeleteApp={this.confirm}
              ClaimApp={this.claim_app}
            />
          </div>
        </main>
        <Confirm
          setIsOpen={this.setopen}
          isOpen={this.state.openmodal}
          Confirm={() => this.delapp(this.id)}
          title={"确认删除"}
        >
          确认删除 {this.id} 吗
        </Confirm>
      </>
    );
  }
}
