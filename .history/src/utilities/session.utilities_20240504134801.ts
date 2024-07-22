import Session from "../models/session.model";
import User from "../models/user.model";
import UserRepository from "../repository/user.repository";

export default class SessionManager {
  constructor() {}

  static async generateNewSession(
    forUser: User,
    { sessionExpiry }: { sessionExpiry: Date }
  );
}