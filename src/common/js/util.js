export default {
    getUrlString(name){
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let str = window.location.search.substr(1).match(reg);

        if (str) {
            return str[2];
        }
        else {
            return undefined;
        }
    }
}