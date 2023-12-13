interface NoSQLWrapper {
    CreateUser: (user: any) => Promise<any>;
    FindAllUsers: () => Promise<any[]>;
    UpdateUsers: (id:any, data:any) => Promise<any>;
    DeleteUsers:(id:string) => Promise<any>;
    FindAllArticles: () => Promise<any[]>;
    CreateYear: (year: any) => Promise<any>;
    FindAllYears: () => Promise<any[]>;
    CreateVolume: (volume: any) => Promise<any>;
    FindAllVolumes: (page:number, limit:number) => Promise<any[]>;
    FindAllVolumeByYear:(year:string, page:number,limit:number)=>Promise<any>;
    CreateArticle: (article: any) => Promise<any>;
    FindAllArticle: () => Promise<any[]>;
    FindArticleById: (article: any) => Promise<any>;
    DeleteArticle: any;
    UpdateArticle: (id: string, article: any) => Promise<any>;

    FindUserByEmail:(user: any) => Promise<any>
    FindUserById:(user: any) => Promise<any>

export default NoSQLWrapper;