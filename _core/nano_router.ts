// inspired by https://codesandbox.io/s/build-own-react-router-v4-mpslz
// from : https://deno.land/x/nano_jsx@v0.0.29/components/router.ts
// update : pathToParams for [...slug].tsx
import { Component } from "https://deno.land/x/nano_jsx@v0.0.29/component.ts";
import {
  _render,
  FC,
  h,
  isSSR,
} from "https://deno.land/x/nano_jsx@v0.0.29/core.ts";
import pathToParams from "./path_to_params.ts";
const instances: Switch[] = [];

const register = (comp: Switch) => instances.push(comp);
const unregister = (comp: Switch) =>
  instances.splice(instances.indexOf(comp), 1);

const historyPush = (path: string) => {
  window.history.pushState({}, "", path);
  instances.forEach((instance) => instance.handleChanges());
  window.dispatchEvent(new Event("pushstate"));
};

const historyReplace = (path: string) => {
  window.history.replaceState({}, "", path);
  instances.forEach((instance) => instance.handleChanges());
  window.dispatchEvent(new Event("replacestate"));
};

export interface MatchPathOptions {
  exact?: boolean;
  path: string;
  regex?: { [param: string]: RegExp };
}
export type MatchPathResult = {
  path: string | null;
  url: string;
  isExact: boolean;
  params: { [param: string]: string };
} | null;

export const matchPath = (
  pathname: string,
  options: MatchPathOptions,
): MatchPathResult => {
  const { exact = false, regex } = options;
  let { path } = options;

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true,
      params: {},
    };
  }

  let match;
  let params: any = {};
  let oriPath = "";
  // path with params
  if (path.includes("/:")) {
    oriPath = path;
    const pathArr = path.split("/");
    const pathnameArr = pathname.split("/");
    pathArr.forEach((p, i) => {
      if (/^:/.test(p)) {
        const key = p.slice(1);
        const value = pathnameArr[i];

        // if a regex is provided, check it it matches
        if (regex && regex[key]) {
          const regexMatch = regex[key].test(value);
          if (!regexMatch) return null;
        }

        params = { ...params, [key]: value };

        pathArr[i] = pathnameArr[i];
      }
    });
    path = pathArr.join("/");
  }

  if (path === "*") {
    match = [pathname];
  }

  // check wild
  if (path !== "*" && oriPath.endsWith("*")) {
    const _params = pathToParams(oriPath, pathname);
    if (_params) {
      params = _params;
      match = [pathname];
    }
  }

  // regular path
  if (!match) match = new RegExp(`^${path}`).exec(pathname);

  if (!match) return null;

  const url = match[0];
  const isExact = pathname === url;

  if (exact && !isExact) return null;
  return {
    path: oriPath,
    url,
    isExact,
    params,
  };
};

export class Switch extends Component<{ fallback?: any; children?: any }> {
  index: number = 0;
  path: string = "";
  match = { index: -1, path: "" };

  didMount() {
    window.addEventListener("popstate", this.handleChanges.bind(this));
    register(this);
  }

  didUnmount() {
    window.removeEventListener("popstate", this.handleChanges.bind(this));
    unregister(this);
  }

  handleChanges() {
    this.findChild();
    if (this.shouldUpdate()) this.update();
  }

  findChild() {
    this.match = { index: -1, path: "" };

    // flatten children
    this.props.children = this.props.children.flat();

    for (let i = 0; i < this.props.children.length; i++) {
      const child = this.props.children[i];
      const { path, exact, regex } = child.props;
      const match = matchPath(
        isSSR() ? _nano.location.pathname : window.location.pathname,
        {
          path,
          exact,
          regex,
        },
      );
      if (match) {
        this.match.index = i;
        this.match.path = path;
        return;
      }
    }
  }

  shouldUpdate() {
    return this.path !== this.match.path || this.index !== this.match.index;
  }

  render() {
    this.findChild();

    const child = this.props.children[this.match.index];

    if (this.match.index === -1) {
      this.path = "";
      this.index = 0;
    }

    if (child) {
      const { path } = child.props;
      this.path = path;
      this.index = this.match.index;
      const el = _render(child);
      return h("div", {}, _render(el));
    } else if (this.props.fallback) {
      return h("div", {}, _render(this.props.fallback));
    } else {
      return h("div", {}, "not found");
    }
  }
}

// alias for <Switch />
export class Routes extends Switch {}

export const Route: FC<
  {
    path: string;
    exact?: boolean;
    regex?: { [param: string]: RegExp };
    children?: any;
  }
> = ({
  path,
  regex,
  children,
}) => {
  // pass the path as props to the children
  children.forEach((child: any) => {
    if (child.props) child.props = { ...child.props, route: { path, regex } };
  });
  return children;
};

export const to = (to: string, replace: boolean = false) => {
  replace ? historyReplace(to) : historyPush(to);
};

interface LinkProps {
  to: string;
  replace?: boolean;
  children?: any;
  [key: string]: any;
}
export const Link: FC<LinkProps> = ({ to, replace, children, ...rest }) => {
  const handleClick = (event: Event) => {
    event.preventDefault();
    replace ? historyReplace(to) : historyPush(to);
    if (rest?.onClick) rest?.onClick(event);
  };
  return h(
    "a",
    { ...rest, href: to, onClick: (e: Event) => handleClick(e) },
    children,
  );
};

class CListener {
  private _route!: string;
  private _listeners: Map<string, Function> = new Map();

  constructor() {
    if (isSSR()) return;

    this._route = window.location.pathname;

    const event = () => {
      const newRoute = window.location.pathname;
      this._listeners.forEach((fnc) => {
        fnc(newRoute, this._route);
      });
      this._route = newRoute;
    };

    window.addEventListener("pushstate", event);
    window.addEventListener("replacestate", event);
  }

  public use() {
    const id = Math.random().toString(36).substring(2);
    return {
      subscribe: (fnc: (currPath: string, prevPath: string) => void) => {
        this._listeners.set(id, fnc);
      },
      cancel: () => {
        if (this._listeners.has(id)) this._listeners.delete(id);
      },
    };
  }
}

let listener: CListener | undefined;
export const Listener = () => {
  if (!listener) listener = new CListener();
  return listener;
};

/** Pass "this.props.route.path" to it. */
export const parseParamsFromPath = (
  path: string,
): { [param: string]: string } => {
  const _pathname = isSSR()
    ? _nano.location.pathname
    : window.location.pathname;
  return pathToParams(path, _pathname) || {};
};
