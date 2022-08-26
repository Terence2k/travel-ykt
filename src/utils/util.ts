import router from "@/router/index";
export const to2 = async () => {
  window.localStorage.setItem("token", "");
  await router.push("/login");
  location.reload();
};
