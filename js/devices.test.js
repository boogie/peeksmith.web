const rewire = require("rewire")
const devices = rewire("./devices")
const PeekSmithDevice = devices.__get__("PeekSmithDevice")
// @ponicode
describe("_sendSmpString", () => {
    let inst

    beforeEach(() => {
        inst = new PeekSmithDevice()
    })

    test("0", () => {
        let callFunction = () => {
            inst._sendSmpString("Mock Error Message")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._sendSmpString("TypeError exception should be raised")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._sendSmpString("This is an exception, voilà")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._sendSmpString("Ran out of iterations")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._sendSmpString("TrainerCourseDetailError: Either not an ajax call or not a GET request!!!")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._sendSmpString(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
