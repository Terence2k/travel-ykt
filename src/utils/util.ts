import router from "@/router/index";
export const to2 = async () => {
  window.localStorage.setItem("authorization", "");
  await router.push("/login");
  location.reload();
};
export const getToken = () => {
  return {
    authorization: JSON.parse(localStorage.getItem('authorization') || '')
  }
}

export const saveToken = (token: any) => {
  const { authorization } = token;
  authorization && localStorage.setItem('authorization', authorization)
}