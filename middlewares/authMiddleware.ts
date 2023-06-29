import { Request, Response, NextFunction } from "express";
import amqp, { Channel } from "amqplib";

const isAuth = async (req: any, res: Response, next: NextFunction) => {
  const amqpServer = "amqp://localhost:5672";
  const connection = await amqp.connect(amqpServer);
  const authChannel = await connection.createChannel();
  await authChannel.assertQueue("Verify-token");
  const header = req.headers["authorization"];
  const token = header?.split(" ")[1]!;

  // authChannel.deleteQueue("Verify-token");

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      status: 401,
    });
  } else {
    authChannel.sendToQueue(
      "My-auth-service",
      Buffer.from(JSON.stringify(token))
    );
    try {
      await authChannel.consume("Verify-token", async (data: any) => {
        // authChannel.ackAll();
        // authChannel.deleteQueue("verify-token");
        authChannel.ack(data);
        const { message, status, user } = JSON.parse(data?.content);
        if (status == 200) {
          const request: any = req;
          req.user = user;
          next();
        } else {
          return res.status(status).json({ error: message });
        }
      });
    } catch (err) {
      authChannel.ackAll();
      // authChannel.deleteQueue("verify-token");
    }
    authChannel.close();
  }
};

export default isAuth;
