import UserSession from "../models/user.model/session.model";
import User from "../models/user.model/user.model";
interface Session {

    sessionID: string;
    sessionOwner: User;
    createdAt: Date;
    lastActivityAt: Date;
    expiresAt: Date;
    ipAddressOfSessionInitialization: string;
    lastIpAddressOfActivity: string;
    
}
