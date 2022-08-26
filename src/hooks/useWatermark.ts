import {
  getCurrentInstance,
  onBeforeUnmount,
  ref,
  Ref,
  shallowRef,
  unref,
} from "vue";

function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== "undefined";
}

const domSymbol = Symbol("watermark-dom");

export function useWatermark(
  appendEl: Ref<HTMLElement | null> = ref(document.body) as Ref<HTMLElement>
) {
  const id = domSymbol.toString();
  const watermarkEl = shallowRef<HTMLElement>();

  const clear = () => {
    const domId = unref(watermarkEl);
    watermarkEl.value = undefined;
    const el = unref(appendEl);
    if (!el) return;
    domId && el.removeChild(domId);
  };

  function createBase64(str: string, title: string) {
    const can = document.createElement("canvas");
    const width = 300;
    const height = 150;
    Object.assign(can, { width, height });

    const cans = can.getContext("2d");
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120);
      cans.font = "15px Vedana";
      cans.fillStyle = "rgba(0, 0, 0, 0.15)";
      cans.textAlign = "center";
      cans.textBaseline = "middle";
      cans.fillText(str, width / 20, height - 20);
      cans.fillText(title, width / 20, height);
    }
    return can.toDataURL("image/png");
  }

  function updateWatermark(
    options: {
      width?: number;
      height?: number;
      str?: string;
      title?: string;
    } = {}
  ) {
    const el = unref(watermarkEl); // 去除响应式
    if (!el) return;
    if (isDef(options.width)) {
      el.style.width = `${options.width}px`;
    }
    if (isDef(options.height)) {
      el.style.height = `${options.height}px`;
    }
    if (isDef(options.str)) {
      el.style.background = `url(${createBase64(
        options.str,
        options.title || ""
      )}) left top repeat`;
    }
  }

  const createWatermark = (str: string, title = "") => {
    if (unref(watermarkEl)) {
      updateWatermark({ str, title });
      return id;
    }
    const div = document.createElement("div");
    watermarkEl.value = div;
    div.id = id;
    div.style.top = "0px";
    div.style.left = "0px";
    div.style.opacity = "0.9";
    div.style.pointerEvents = "none"; // 去掉鼠标事件
    div.style.position = "fixed";
    div.style.zIndex = "100000";
    const el = unref(appendEl);
    if (!el) return id;
    const { clientHeight: height, clientWidth: width } = el;
    updateWatermark({ str, title, width, height });
    el.appendChild(div);
    return id;
  };

  function setWatermark(str: string, title = "") {
    createWatermark(str, title);
    const instance = getCurrentInstance();
    if (instance) {
      onBeforeUnmount(() => {
        clear();
      });
    }
  }

  return { setWatermark, clear };
}
