interface NoSQLWrapper {
    CreateUser: (user: any) => Promise<any>;
    FindAllUsers: () => Promise<any[]>;
    CreateYear: (year: any) => Promise<any>;
    FindAllYears: () => Promise<any[]>;
    CreateVolume: (volume: any) => Promise<any>;
    FindAllVolumes: (page:number, limit:number) => Promise<any[]>;
    
    FindAllVolumeByYear:(year:string, page:number,limit:number)=>Promise<any>;
}
export default NoSQLWrapper;