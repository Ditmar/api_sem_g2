import server from './server'
import UserRouter from './presentation/routers/user-router';
import { MongoClient, ObjectId } from 'mongodb';
import NoSQLWrapper from './data/interfaces/data-sources/no-sql-wrapper';
import { Response } from 'express';
import YearRouter from './presentation/routers/year-router';
import VolumeRouter from './presentation/routers/volume-router';
import { isArgumentsObject } from 'util/types';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//mongo
const getMongoDBClient = async (): Promise<NoSQLWrapper> => {
    //mongodb://admin:password@localhost:27017/db
    const stringConnection = `mongodb://${process.env.API_MONGO_USERNAME}:${process.env.API_MONGO_PASSWORD}@localhost:27017`
    const uri = stringConnection;
    const client = new MongoClient(uri);

    client.connect();
    const database = process.env.API_MONGO_DBNAME;
    
    const db = client.db(database);
    const CreateUser = async (user: any): Promise<any> => {
        const result = await db.collection('users').insertOne(user);
        
        return {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        };
    }
    const FindAllUsers = async (): Promise<any[]> => {
        const result = await db.collection('users').find({}).toArray();
        return result;
    }


    const CreateYear= async (year: any): Promise<any> => {
        const result = await db.collection('years').insertOne(year);
        
        return {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        };
    }

    const FindAllYears = async (): Promise<any[]> => {
        const result = await db.collection('years').find({}).toArray();
        return result;
    }

    const CreateVolume= async (volume: any): Promise<any> => {
        const result = await db.collection('volumes').insertOne(volume);
        
        return {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        };
    }

    const FindYearbyName = async(name:string): Promise<any> => {
        const result = await db.collection('years').findOne({ name });

        return result;
    }
    const FindAllVolumes = async(page:number, limit:number): Promise<any[]> => {
    const skip = (page - 1) * limit;
    const result = await db.collection('volumes').find({}).skip(skip).limit(limit).toArray();
    return result;
    };


    const FindAllVolumeByYear = async (year:string,page:number,limit:number): Promise<any> => {
        let resultYear: any = { name: '' };

        try {
            resultYear = await FindYearbyName(year);
            
        } catch(error: any) {
            return error;
        }
        
        const objectYearID = new ObjectId(resultYear._id);
          
        const skip = (page - 1) * limit;
        const result = await db.collection('volumes').find({ year: objectYearID.toString() }).skip(skip).limit(limit).toArray();
        return result;
    }

    return {
        CreateUser,
        FindAllUsers,
        CreateYear,
        FindAllYears,
        CreateVolume,
        FindAllVolumes,
        
        FindAllVolumeByYear
    }
}

// const getPgDBClient = () => {

// }
// //todo homework
// const getSqlServerClient = () => {

// }

(async() => {
    const db = await getMongoDBClient();
    server.use('/api', UserRouter(db));
    server.use('/api', YearRouter(db));
    server.use('/api', VolumeRouter(db));
    const port = process.env.API_PORT || 3000;
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
})();


