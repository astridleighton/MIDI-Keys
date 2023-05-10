import * as mysql from "mysql";
import * as util from "util";
import { UserModel } from "../models/UserModel";

export class dao
{
    private host:string = "localhost";
    private username:string = "root"
    private password:string = "root"
    private port:number = 3306;
    private schema:string = "capstone";
    pool: any;

    constructor(host:string, port:number, username:string, password:string)
    {
        this.pool = this.setupDBConnection();
    }

    private setupDBConnection():any
    {
        return mysql.createPool({
            host: this.host,
            port: this.port,
            user: this.username,
            password: this.password,
            database: "capstone",
            connectionLimit: 10
        })
    }

    public listAllUsers(callback:any)
    {
        let users:UserModel[] = [];

        this.pool.getConnection(async function(error: any, connection:any)
        {
            connection.release();
            if (error) throw error;

            connection.query = util.promisify(connection.query);
            let sql = await connection.query("SELECT * FROM USERS");

            for(let x = 0; x < sql.length; x++)
            {
                users.push(new UserModel(sql[x].ID, sql[x].username, sql[x].password));
            }

            callback(users);
        })
    }
}

