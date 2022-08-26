addEventListener("message", (e) => {
  const { data } = e;
  console.log(data);
  setTimeout(() => {
    return postMessage("线程完成");
  }, 4000);
});
export default {};
