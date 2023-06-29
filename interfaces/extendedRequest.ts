import {Request} from "express"

interface ExtendedRequest extends Request{
    user? : any
}

export default ExtendedRequest