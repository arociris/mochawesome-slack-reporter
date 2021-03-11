const expect = require('chai').expect
describe("This is first describe",()=>{
    it("Should be @first tag",()=>{
    console.log("hello")
    })
    it("Should be @second tag",()=>{
        expect.fail()
    })
})

describe("This is @third describe",()=>{
    it("Should be pass",()=>{
        console.log("hello")
    })
    it("Should be fail",()=>{
        expect.fail()
    })
})