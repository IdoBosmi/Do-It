// src/server.ts
import express, { Request, Response } from 'express';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3001;

const dynamoDB = new DynamoDB.DocumentClient();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the backend!');
});

app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: 'Tasks',
    };

    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const id = uuidv4();

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'Tasks',
      Item: {
        id,
        title,
      },
    };

    await dynamoDB.put(params).promise();
    res.status(201).json({ id, title });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
