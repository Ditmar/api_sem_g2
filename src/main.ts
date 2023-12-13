import server from './server'
import UserRouter from './presentation/routers/user-router';
import { MongoClient, ObjectId } from 'mongodb';
import mockData from './__mock__/data';
import NoSQLWrapper from './data/interfaces/data-sources/no-sql-wrapper';
import { Response } from 'express';
import YearRouter from './presentation/routers/year-router';
import VolumeRouter from './presentation/routers/volume-router';
import { isArgumentsObject } from 'util/types';
import { ArticlesRouter } from './presentation/routers/articles-router';
import { RegisterRouter,  } from './presentation/routers/register-user-route';
import { LoginRouter } from './presentation/routers/login-user-route';

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

    //artitles
    const FindAllArticles = async (): Promise<any[]> => {
        const result = await db.collection('articles').find({}).toArray();
        return mockData;
      };

    const DeleteUsers = async(id:string): Promise<any> => {
        const objID = new ObjectId(id);
        const result = await db.collection('users').findOneAndDelete({_id :objID});

        return result;
    }
    const UpdateUsers = async(id:any,data:any): Promise<any> => {
        const objID = new ObjectId(id);
        const updateData = data;

        const result = await db.collection('users').replaceOne({_id :objID}, updateData);
        return result;
    }
    return {
        CreateUser,
        FindAllUsers,   
        DeleteUsers,
        UpdateUsers,
        FindAllArticles,

    }
    const CreateYear= async (year: any): Promise<any> => {
    const result = await db.collection('years').insertOne(year);

        return {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId,
        };

    const CreateArticle = async (article: any): Promise<any> => {
        const result = await db.collection('articles').insertOne(article);
        console.log(`New article created with the following id: ${result.insertedId}`);
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

    const FindAllArticle = async (): Promise<any[]> => {
        const result = await db.collection('articles').find({}).toArray();
        return result;
    }
    const FindArticleById = async (id:string): Promise<any> => {
        const objectId = new ObjectId(id);
        const result = await db.collection('articles').findOne({_id:objectId});
        return result;
    }
    const UpdateArticle = async (id:string,article: any): Promise<any> => {
        const objectId = new ObjectId(id);  
        const result = await db.collection('articles').findOneAndUpdate(
            { _id: objectId },
            { $set: article }, 
            { returnDocument: 'after' } 
          ); 
        return result;
    }
    const DeleteArticle = async (id:string) => {
        const objectId = new ObjectId(id);
        await db.collection('articles').findOneAndDelete({_id:objectId});   
    }
    const FindUserByEmail = async (email:string): Promise<any> => {
        const result = await db.collection('users').findOne({email:email});
        return result;
    }
    const FindUserById = async (id:any): Promise<any> => {
        const objectId = new ObjectId(id);
        const result = await db.collection('users').findOne({_id:objectId});
        return result;
    }
    return {
        CreateUser,
        FindAllUsers,
        CreateArticle,
        FindAllArticle,
        FindArticleById,
        DeleteArticle,
        UpdateArticle,
        CreateYear,
        FindAllYears,
        CreateVolume,
        FindAllVolumes,
        FindAllVolumeByYear,
        FindUserByEmail,
        FindUserById
    }
}

(async() => {
    const db = await getMongoDBClient();

    server.use('/api', UserRouter(db));
    server.use('/api', YearRouter(db));
    server.use('/api', VolumeRouter(db));
    server.use('/api', ArticlesRouter(db));
    server.use('/api', RegisterRouter(db));
    server.use('/api', LoginRouter(db));

    const port = process.env.API_PORT || 3000;
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
})();


