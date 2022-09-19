
function importAll(modules: any) {
    const apiList: any = {};
    console.log(modules)
    for (const key in modules) {
        const res =  modules[key]
        for (let k in res) {
            apiList[k] = res[k]
        }
    }
    
    return apiList
}


export default importAll(import.meta.globEager('./*.api.ts'))