"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = 3001;
const dynamoDB = new aws_sdk_1.DynamoDB.DocumentClient();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});
app.get('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            TableName: 'Tasks',
        };
        const data = yield dynamoDB.scan(params).promise();
        res.json(data.Items);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
}));
app.post('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const id = (0, uuid_1.v4)();
        const params = {
            TableName: 'Tasks',
            Item: {
                id,
                title,
            },
        };
        yield dynamoDB.put(params).promise();
        res.status(201).json({ id, title });
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send('Internal Server Error');
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
