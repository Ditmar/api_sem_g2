interface NoSQLWrapper {
    CreateUser: (user: any) => Promise<any>;
    FindAllUsers: () => Promise<any[]>;

    CreateArticle: (article: any) => Promise<any>;
    FindAllArticle: () => Promise<any[]>;
    FindArticleById: (article: any) => Promise<any>;
    DeleteArticle: any;
    UpdateArticle: (id: string, article: any) => Promise<any>;

    FindUserByEmail:(user: any) => Promise<any>
    FindUserById:(user: any) => Promise<any>
}
export default NoSQLWrapper;