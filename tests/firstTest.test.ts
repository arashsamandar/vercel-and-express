import app from "..";
import request from 'supertest';

describe('just doing some shitty test here baby',()=>{
    it('checks \'havij route\'',async()=>{
        const response = await request(app).get('/havij');
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual('hello samandar');
        // what is the difference between 'toBe` and `toEqual` anyways :| ?
    });
});