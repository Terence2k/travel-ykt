import router from "@/router/index";
export const to2 = async () => {
  window.localStorage.setItem("token", "");
  await router.push("/login");
  location.reload();
};
export const getToken = () => {
  return {
    authorization: sessionStorage.getItem('authorization') || 'eyJhbGciOiJIUzUxMiIsInppcCI6IkRFRiJ9.eJztU02r00AU_S-zbrFj0zTtrtYKgTaVVlcij9vJzevoZCZMJrWPR0F0oYsHfoBfOxHcunblrzHi-xdO8lqLNOleeBAI954zd87MnHNOIDNL0j8v_0pzwzEl_Qf7-oz0yQ2m4hg14yDIpnGAZYmSh31cgcjA8CpsqWKs6hoUvoxUFZSlODdgKpbFIDMQwxoZKkFdqpiAhFOMUZoKkg5R17SHAkFzeTpDZusa0rHhiQATKR3PlTblnHXlHI1RJsNptRKNK5QZ1mnQSuAxCVqpeKLCuttNUa84wwLUcc2Tpdki5eHZIWAf5tjxZ9Px6OSOHwyCoT8YnwxuT_ygmjS9O5oN7vnTYH6MNb9vaTvCwwYJ0QAX1rMyE6JR8q0MzqxVQtI3OsMGSez7MZ5Y91qjJ5CmT4pb3K4o9EuwfuwT6rU9z73pOI5HGteJuE7Ef5kIYNaA0gRKjtYJ1_sY7IGxYo_3fWY5RWZApIeLUMJC7EseFjnpdIp8rMCA3sUoVgsu8G9ls7EEafyCXqaptPItVSTwytUWoS1nCwRXAfz5_WN-8SF_dXH549Pv118v373I3z7L3z8vvjdP829ffn1-STabfyTvtqzIsCU-Mtw2WRT10GHQ7LXooulQjzbBi3pNSmnbbXe6SBGtRg7GinJd2u24Xdqyh18n20bXUlubP3NpjYQ.Q2kGVrzeoqNn6B5gRhkWGEoE0NYidQZw1Pe1jqzwWS0RrLa-lUqytvkNDtfSiQGnd6DDGFOJ46YwdOnTqhRShw'
  }
}

export const saveToken = (token: any) => {
  const { authorization } = token;
  authorization && sessionStorage.setItem('authorization', authorization)
}