import router from "@/router/index";
export const to2 = async () => {
  window.localStorage.setItem("authorization", "");
  await router.push("/login");
  location.reload();
};
export const getToken = () => {
  return {
    authorization: sessionStorage.getItem('authorization') || '68e2b64f-30d8-44c4-bbdf-3a2021bb94d3'
  }
}

export const saveToken = (token: any) => {
  const { authorization } = token;
  authorization && sessionStorage.setItem('authorization', authorization)
}