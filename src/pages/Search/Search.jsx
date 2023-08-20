import styles from "./Search.module.css";

import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";
import PostDetails from "../../components/PostDetails/PostDetails";
import { Link } from "react-router-dom";

const Search = () => {
    const query = useQuery();
    const search = query.get("q");

    const {documents: posts} = useFetchDocuments("posts", search);
    return(
        <div className={styles.search_conatiner}>
            <h1>Pesquisa</h1>
            <div>
                {posts && posts.length === 0 && (
                    <div className={styles.nopost}>
                        <p >Não foram encontrado posts a partir da sua busca.</p>
                        <Link className="btn btn-dark" to={"/"}>Voltar</Link>
                    </div>
                )}
                {posts && posts.map(post => (
                    <PostDetails key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Search;