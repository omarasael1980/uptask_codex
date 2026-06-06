import jwt from "jsonwebtoken";

type UserPayload = {
  id: string;
};
export const generateToken = (payload: UserPayload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const response = jwt.verify(token, process.env.JWT_SECRET);
  return response;
};
