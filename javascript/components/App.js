import React, { Component } from "react";

import { Router, Switch, Route, Link, withRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

import * as jwt_decode from "jwt-decode";

import { ThemeProvider } from "@material-ui/styles";
import theme from "../muiTheme";

import { Provider, connect } from "react-redux";
import store from "../store";
import { ActionCreators } from "../actions";
const mapStateToProps = (state) => ({
  username: state.user.username,
});
const mapDispatchToProps = (dispatch) => ({});
const initApp = () => {
  const token = localStorage.getItem("open-access-api-refresh-token");
  if (token) {
    let decodedToken = jwt_decode(token);
    let d = new Date(0);
    d.setUTCSeconds(decodedToken.exp);
    if (new Date() < d) store.dispatch(ActionCreators.autoLogin(decodedToken));
  }
};
initApp();

import smoothscroll from "smoothscroll-polyfill";
smoothscroll.polyfill();

import { live } from "../utils/helpers";

import CircularProgress from "@material-ui/core/CircularProgress";
class DynamicImport extends Component {
  state = {
    component: null,
  };
  componentDidMount() {
    this.props.load().then((component) => {
      this.setState(() => ({
        component: component.default ? component.default : component,
      }));
    });
  }

  render() {
    return this.props.children(this.state.component);
  }
}

import AuthRedirect from "./AuthRedirect";
import UnAuthRedirect from "./UnAuthRedirect";
import ScrollTopButton from "./ScrollTopButton";
const CompLoader = () => (
  <CircularProgress disableShrink style={{ position: "fixed", top: "40%" }} />
);
//import Account from "./Account";
const Account = (props) => (
  <DynamicImport load={() => import("./Account")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import Payment from "./Payment";
const Payment = (props) => (
  <DynamicImport load={() => import("./Payment")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import SignIn from "./SignIn";
const SignIn = (props) => (
  <DynamicImport load={() => import("./SignIn")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import Logout from "./Logout";
const Logout = (props) => (
  <DynamicImport load={() => import("./Logout")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import SignUp from "./SignUp";
const SignUp = (props) => (
  <DynamicImport load={() => import("./SignUp")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

import SiteNav from "./SiteNav";

//import Profile from "./Profile";
const Profile = (props) => (
  <DynamicImport load={() => import("./Profile")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import NotePage from "./NotePage";
const NotePage = (props) => (
  <DynamicImport load={() => import("./NotePage")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import NoteUploader from "./NoteUploader";
const NoteUploader = (props) => (
  <DynamicImport load={() => import("./NoteUploader")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import VideoPage from "./VideoPage";
const VideoPage = (props) => (
  <DynamicImport load={() => import("./VideoPage")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import VideoUploader from "./VideoUploader";
const VideoUploader = (props) => (
  <DynamicImport load={() => import("./VideoUploader")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import VideoUploader from "./VideoUploader";
const VideoEdit = (props) => (
  <DynamicImport load={() => import("./VideoEdit")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import ImagePage from "./ImagePage";
const ImagePage = (props) => (
  <DynamicImport load={() => import("./ImagePage")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import ImageUploader from "./ImageUploader";
const ImageUploader = (props) => (
  <DynamicImport load={() => import("./ImageUploader")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import NewsFeed from "./NewsFeed";
const NewsFeed = (props) => (
  <DynamicImport load={() => import("./NewsFeed")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import NewsFeed from "./SearchResultsPage";
const SearchResultsPage = (props) => (
  <DynamicImport load={() => import("./SearchResultsPage")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import NewsFeed from "./SearchResultsPage";
const UsersList = (props) => (
  <DynamicImport load={() => import("./UsersList")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import Home from "./Home";
const Home = (props) => (
  <DynamicImport load={() => import("./Home")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import PasswordReset from "./PasswordReset";
const PasswordReset = (props) => (
  <DynamicImport load={() => import("./PasswordReset")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);
//import Terms from "./Terms";
const Terms = (props) => (
  <DynamicImport load={() => import("./Terms")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);
//import PrivacyPolicy from "./PrivacyPolicy";
const PrivacyPolicy = (props) => (
  <DynamicImport load={() => import("./PrivacyPolicy")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

//import NotFound from "./NotFound";
const NotFound = (props) => (
  <DynamicImport load={() => import("./404")}>
    {(Component) =>
      Component == null ? <CompLoader /> : <Component {...props} />
    }
  </DynamicImport>
);

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }

  render() {
    return this.props.children;
  }
}

ScrollToTop = withRouter(ScrollToTop);

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener("click", function (e) {
      if (e.target.dataset.nativelink != null) {
        e.preventDefault();
        e.stopPropagation();
        history.push(e.target.getAttribute("href"));
      }
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Router history={history}>
        <div>
          <SiteNav />
          <div className="site-content">
            <ScrollToTop>
              <Switch>
                <Route
                  path="/sign-in"
                  render={(props) => (
                    <AuthRedirect {...props} component={SignIn} />
                  )}
                />
                <Route path="/logout" component={Logout} />
                <Route
                  path="/sign-up"
                  render={(props) => (
                    <AuthRedirect {...props} component={SignUp} />
                  )}
                />
                <Route
                  path="/my-account"
                  render={(props) => (
                    <UnAuthRedirect {...props} component={Account} />
                  )}
                />
                <Route
                  path="/payment"
                  render={(props) => (
                    <UnAuthRedirect {...props} component={Payment} />
                  )}
                />
                <Route
                  path="/note/:noteId"
                  render={(props) => (
                    <UnAuthRedirect
                      key={`${props.match.params.noteId} ${props.location.search}`}
                      {...props}
                      component={NotePage}
                    />
                  )}
                />
                <Route
                  path="/note-upload"
                  render={(props) => (
                    <UnAuthRedirect {...props} component={NoteUploader} />
                  )}
                />
                <Route
                  path="/image/:imageId"
                  render={(props) => (
                    <UnAuthRedirect
                      key={`${props.match.params.imageId} ${props.location.search}`}
                      {...props}
                      component={ImagePage}
                    />
                  )}
                />
                <Route
                  path="/image-upload"
                  render={(props) => (
                    <UnAuthRedirect {...props} component={ImageUploader} />
                  )}
                />
                <Route
                  path="/video-player/:videoId"
                  render={(props) => (
                    <UnAuthRedirect
                      key={`${props.match.params.videoId} ${props.location.search}`}
                      {...props}
                      component={VideoPage}
                    />
                  )}
                />
                <Route
                  path="/video-upload"
                  render={(props) => (
                    <UnAuthRedirect {...props} component={VideoUploader} />
                  )}
                />
                <Route
                  path="/video/edit/:videoId"
                  render={(props) => (
                    <UnAuthRedirect {...props} component={VideoEdit} />
                  )}
                />
                <Route
                  path="/profile/:username"
                  render={(props) => (
                    <UnAuthRedirect
                      key={props.match.params.username}
                      {...props}
                      component={Profile}
                    />
                  )}
                />
                <Route
                  path="/feed"
                  render={(props) => (
                    <UnAuthRedirect {...props} component={NewsFeed} />
                  )}
                />
                <Route
                  path="/search"
                  render={(props) => (
                    <UnAuthRedirect
                      {...props}
                      key={props.location.search}
                      component={SearchResultsPage}
                    />
                  )}
                />
                <Route
                  path="/users"
                  render={(props) => (
                    <UnAuthRedirect {...props} component={UsersList} />
                  )}
                />
                <Route
                  path="/password-reset/:tempKey?"
                  render={(props) => (
                    <AuthRedirect {...props} component={PasswordReset} />
                  )}
                />
                <Route exact path="/terms" component={Terms} />
                <Route exact path="/pp" component={PrivacyPolicy} />
                <Route
                  exact
                  path="/"
                  render={(props) => (
                    <AuthRedirect {...props} component={Home} />
                  )}
                />
                <Route path="*" component={NotFound} />
              </Switch>
            </ScrollToTop>
          </div>
          <ScrollTopButton />
        </div>
      </Router>
    );
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default (
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
