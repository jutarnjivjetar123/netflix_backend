import UserSession from "../models/user.model/session.model";
import User from "../models/user.model/user.model";
interface Session {

    user: User;
    sessionID: string;
    createdAt: Date;
    lastActivityAt: Date;
    expiresAt: Date;
    ipAddressOfSessionInitialization?: string;
    lastIpAddressOfActivity: string;
    userAgent: string;
    authToken: string;
    crsfToken: string;
}
