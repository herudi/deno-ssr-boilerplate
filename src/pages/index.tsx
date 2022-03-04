/** @jsx h */
import { Component, h, Helmet } from "nano-jsx";
import { tw } from "twind";
import { PageProps } from "types";

const style = {
  button: "text-2xl px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100",
};

class Home extends Component<PageProps> {
  value = 0;
  changeValue(newValue: number) {
    this.value += newValue;
    this.update();
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>Hello Home Page</title>
        </Helmet>
        <div class={tw`bg-white flex justify-center h-screen`}>
          <div>
            <h3 class={tw`text-5xl text-center mt-20 mb-20 text-gray-600`}>
              Counter App
            </h3>
            <div class={tw`text-center`}>
              <button
                class={tw`${style.button}`}
                onClick={() => this.changeValue(1)}
              >
                +
              </button>
              <span
                class={tw`p-5 text-2xl text-sm font-semibold text-blue-800`}
              >
                {this.value}
              </span>
              <button
                class={tw`${style.button}`}
                onClick={() => this.changeValue(-1)}
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
