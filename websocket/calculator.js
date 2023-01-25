class Client {
    init(id, comunication) {
        this.id = id;
        this.comunication = comunication;
        this.comunication.handler = this;
    }

    newMsg(content) {
        eval("this." + content.funct + "(" + JSON.stringify(content) +")");    
    }
}
export {Client};