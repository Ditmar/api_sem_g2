import Year from './Year';

interface Volume {
    id: string;
    year: string;
    title: string;
    coverImage: string;
    metadata: {
        author: string;
        genre: string;
    };
}
export default Volume;