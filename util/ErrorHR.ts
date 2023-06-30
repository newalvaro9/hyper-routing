export default class ErrorHR extends Error {
    constructor(name: string, message: string) {
        super(message)
        this.name = name;
    }
}