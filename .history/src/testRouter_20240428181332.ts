import express from "express";

const testRoute = express.Router();
testRoute.use(express.json());

testRoute.get("/test", (req: Express.Request, res: Express.Response) => { 
    
})