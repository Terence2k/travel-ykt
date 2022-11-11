import { createVNode, render } from "vue";
import Loading from "./Loading.vue";
const loading = () => {
  let container: HTMLElement | null = null;
  const show = (zindex?: number) => {
    if (container) {
      hidden();
    }
    container = document.createElement("div");
    container.className = "my_Loading";
    container.style.zIndex = zindex ? zindex.toString() : "2000";
    const vm = createVNode(Loading);
    render(vm, container);
    // document.body.append(container.firstElementChild)
    document.body.append(container);
  };
  const hidden = () => {
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
  };
  return {
    show,
    hidden,
  };
};

export default loading();
