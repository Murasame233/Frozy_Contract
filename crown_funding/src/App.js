import NavBar from "./compoents/nav";
import Modal from "./compoents/login_modal";
import Buy from "./page/buy";
import Home from "./page/home";
import Create from "./page/create";
import My from "./page/my";
import Donate from "./page/donate";
import { get_ALL, get_Assets } from "./utils/algorand";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Component } from "react";
class App extends Component {
  constructor() {
    super();
    var islogin = false;
    var address;
    var assets = 0;
    if (localStorage.getItem("address") || address) {
      islogin = true;
      address = localStorage.getItem("address");
      assets = localStorage.getItem("assets");
    }
    this.state = {
      islogin,
      address,
      assets,
      ismodalopen: false,
      accounts: null,
    };
  }
  login = (account) => {
    get_Assets(account.address, (a) => {
      account.assets = a;
      this.setState({
        ...this.state,
        ismodalopen: false,
        islogin: true,
        address: account.address,
        assets: account.assets,
      });

      localStorage.setItem("address", account.address);
      localStorage.setItem("assets", account.assets);
    });
  };
  logout = () => {
    this.setState({
      ...this.state,
      islogin: false,
      address: null,
      assets: 0,
    });

    localStorage.removeItem("address");
    localStorage.removeItem("assets");
  };
  setmodal = (state) => {
    if (state === true) {
      get_ALL((a) => {
        console.log(a);
        this.setState({ ...this.state, accounts: a, ismodalopen: state });
      });
    } else {
      this.setState({ ...this.state, ismodalopen: false });
    }
  };
  render() {
    return (
      <>
        <Router>
          <Modal
            isOpen={this.state.ismodalopen}
            setIsOpen={this.setmodal}
            accounts={this.state.accounts}
            login={this.login}
          ></Modal>
          <NavBar
            islogin={this.state.islogin}
            openModal={this.setmodal}
            logout={this.logout}
            assets={this.state.assets}
          ></NavBar>
          <Switch>
            <Route path="/my">
              <My address={this.state.address} />
            </Route>
            <Route path="/donate">
              <Donate address={this.state.address} />
            </Route>
            <Route path="/buy">
              <Buy />
            </Route>
            <Route path="/create">
              <Create account={this.state.address} />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
