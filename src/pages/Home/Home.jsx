import styles from "./Home.module.css";

import { useNavigate, Link} from "react-router-dom";
import { useState } from "react";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import PostDetails from "../../components/PostDetails/PostDetails";


const Home = () => {
    const [query, setQuery] = useState("");
    const {documents: posts, loading} = useFetchDocuments("posts");

    const Navigate = useNavigate();
    const handleSubmit = (evento) => {
        evento.preventDefault();

        if(query){
            return Navigate(`/search?q=${query}`);
        }

    };
    return (
        <div className={styles.home}>
            <h1>Post mais recentes</h1>
            <form className={styles.search_form} onSubmit={handleSubmit}>
                <input type="text" placeholder="Busque por tags..." onChange={e => setQuery(e.target.value)}/>
                <button className="bnt bnt-dark">Pesquisar</button>
            </form>
            <div>
                {loading && <p>carregando...</p>}
                {posts && posts.map(post => (
                    <PostDetails key={post.id} post={post} />
                ))}
                {posts && posts.length === 0 &&  (
                    <div className={styles.noposts}>
                        <p>Não foram encontrados posts</p>
                        <Link className="btn" to={"/posts/create"}>Criar primeiro post</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;