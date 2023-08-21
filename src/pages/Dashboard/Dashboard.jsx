import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";
import {useAuthValue} from "../../context/AuthContext";
import {useFetchDocuments} from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

const Dashboard = () => {
    const {user} = useAuthValue();
    const uid = user.uid;

    const {documents: posts, loading, error} = useFetchDocuments("posts", null, uid);

    const {deleteDocument, response} = useDeleteDocument("posts");

    if(loading) {
        return <p>Carregando...</p>;
    }
    return (
        <div className={styles.dashboard}>
            <h2>Dashboard</h2>
            <p>Gerencie os seus posts</p>
            {posts && posts.length === 0 ? (
                <div className={styles.noposts}>
                    <p>Não foram encontrados posts</p>
                    <Link className="btn " to="/posts/create">Criar primeiro post</Link>
                </div>
            ) : (
                <>
                    <div className={styles.post_header}>
                        <span>Título</span>
                        <span>Ações</span>
                    </div>
                    {posts && posts.map(post => <div className={styles.post_row} key={post.id}>
                        <p>{post.title}</p>
                        <div>
                            <Link className="btn btn-outline" to={`/posts/${post.id}`}>Ver</Link>
                            <Link className="btn btn-outline" to={`/posts/edit/${post.id}`}>Editar</Link>
                            <button className="btn btn-outline btn-danger" onClick={() => deleteDocument(post.id)}>Excluir</button>
                        </div>
                    </div>)}
                </>
            )}
        </div>
    );
};

export default Dashboard;